const { createSuccessResponse, createErrorResponse } = require('../../response');
const Fragment = require('../../model/fragment');
const logger = require('../../logger');
const API_URL = process.env.API_URL || 'http://localhost:8080';

// Support sending various Content-Types on the body up to 5M in size
module.exports = async (req, res) => {
  try {
    if (!Fragment.isSupportedType(req.headers['content-type'])) {
      return res.status(415).json(createErrorResponse(415, 'type is not supported!'));
    }

    const fragment = new Fragment({
      ownerId: req.user,
      type: req.headers['content-type'],
      size: Buffer.byteLength(req.body),
      created: new Date(),
      updated: new Date(),
    });

    logger.debug('Saving fragment...');
    await fragment.save();
    logger.debug('Fragment saved.');
    logger.debug('Setting fragment data...');
    await fragment.setData(req.body);
    logger.debug('Fragment data set.');

    logger.debug({ fragment }, 'POST /fragments');

    res.location(`${API_URL}/v1/fragments/${fragment.id}`);
    console.log('Location header set to:', res.get('Location'));
    res.status(201).json(createSuccessResponse({ fragment }));
  } catch (error) {
    res.status(500).json(createErrorResponse(500, error.message));
  }
};
