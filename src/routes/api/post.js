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
  try {
    if (!Buffer.isBuffer(req.body)) {
      return res.status(400).send('Invalid data format');
    }

    const ownerId = req.user.id;
    const fragment = new Fragment({
      ownerId: ownerId,
      type: req.headers['content-type'],
      size: req.body.length,
    });

    await fragment.setData(req.body);
    await fragment.save();

    const apiUrl = process.env.API_URL || `http://localhost:8080`;

    logger.info('Fragment created successfully with ID:', fragment.id);

    res.setHeader('Location', `${apiUrl}/v1/fragments/${fragment.id}`);
    res.status(201).json({
      id: fragment.id,
      ownerId: fragment.ownerId,
    });
  } catch (error) {
    logger.error('Error creating fragment:', error.message);
    res.status(500).json({ error: error.message });
    next(error);
  }
});

module.exports = router;
