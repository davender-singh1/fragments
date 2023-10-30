const express = require('express');
const contentType = require('content-type');
const Fragment = require('../../model/fragment');
const logger = require('../../logger.js');
const router = express.Router();

const rawBody = () =>
  express.raw({
    inflate: true,
    limit: '5mb',
    type: (req) => {
      const { type } = contentType.parse(req);
      return Fragment.isSupportedType(type);
    },
  });

router.post('/fragments', rawBody(), async (req, res, next) => {
  console.log('Inside POST /v1/fragments');
  try {
    if (!Buffer.isBuffer(req.body)) {
      logger.warn('Invalid data format for POST request to /fragments.');
      return res.status(400).send('Invalid data format');
    }

    const ownerId = req.user.id; // Assuming some authentication middleware set `req.user`
    const fragment = new Fragment({
      ownerId: ownerId,
      type: req.headers['content-type'],
      size: req.body.length,
    });

    await fragment.setData(req.body);
    await fragment.save();

    const apiUrl = process.env.API_URL || `http://${req.headers.host}`;

    // Log successful fragment creation
    logger.info('Fragment created successfully with ID:', fragment.id);

    // When setting the Location header:
    res.setHeader('Location', `${apiUrl}/path/to/fragment/${fragment.id}`);
    res.status(201).json({ id: fragment.id, ownerId: fragment.ownerId });
  } catch (error) {
    logger.error('Error creating fragment:', error.message);
    next(error);
  }
});

module.exports = router;
