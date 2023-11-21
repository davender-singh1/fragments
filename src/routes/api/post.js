const express = require('express');
const contentType = require('content-type');
const Fragment = require('../../model/fragment');
const logger = require('../../logger');
const router = express.Router();

// Middleware to enforce raw body and check for supported content type
const rawBodyMiddleware = express.raw({
  inflate: true,
  limit: '5mb',
  type: (req) => {
    try {
      const { type } = contentType.parse(req);
      if (!Fragment.isSupportedType(type)) {
        return false;
      }
      return type;
    } catch (error) {
      return false;
    }
  },
});

router.post('/fragments', rawBodyMiddleware, async (req, res) => {
  try {
    // Check if body is parsed as a buffer and is of a supported type
    if (!Buffer.isBuffer(req.body) || !Fragment.isSupportedType(req.headers['content-type'])) {
      return res.status(400).send('Invalid data format');
    }

    // Check if user is authenticated
    if (!req.user || !req.user.id) {
      logger.error('Authentication failed: req.user or req.user.id is not set');
      return res.status(401).send('Authentication required');
    }

    const ownerId = req.user.id;
    const fragment = new Fragment({
      ownerId: ownerId,
      type: req.headers['content-type'],
      size: req.body.length,
    });

    // Save the fragment data
    await fragment.setData(req.body);
    await fragment.save();

    const apiUrl = process.env.API_URL || 'http://localhost:8080';
    logger.info(`Fragment created successfully with ID: ${fragment.id}`);

    res.setHeader('Location', `${apiUrl}/v1/fragments/${fragment.id}`);
    res.status(201).json({
      id: fragment.id,
      ownerId: fragment.ownerId,
    });
  } catch (error) {
    logger.error(`Error creating fragment: ${error.message}`);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
