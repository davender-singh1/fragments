const express = require('express');
const contentType = require('content-type');
const Fragment = require('../../src/model/fragment'); // Adjust the path to your Fragment model
const logger = require('../logger.js');
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

router.post('/fragments', rawBody(), async (req, res) => {
  logger.debug('Received POST request to /fragments with payload:', req.body);

  // Check for valid data format
  if (!Buffer.isBuffer(req.body)) {
    logger.warn('Invalid data format for POST request to /fragments.');
    return res.status(400).send('Invalid data format');
  }

  try {
    const fragment = new Fragment({
      ownerId: 'yourOwnerId', // replace with actual ownerId logic
      type: req.headers['content-type'],
    });

    await fragment.setData(req.body);
    await fragment.save();
    const apiUrl = process.env.API_URL || `http://${req.headers.host}`;

    // Log successful fragment creation
    logger.info('Fragment created successfully with ID:', fragment.id);

    // When setting the Location header:
    res.setHeader('Location', `${apiUrl}/path/to/fragment/${fragment.id}`);
    res.status(201).send({ id: fragment.id });
  } catch (error) {
    logger.error('Error creating fragment:', error.message);
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

module.exports = router;
