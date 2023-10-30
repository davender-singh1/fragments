// src/routes/api/get.js
const { createSuccessResponse, createErrorResponse } = require('../../response');

/**
 * Get a list of fragments for the current user
 */
module.exports = (req, res) => {
  try {
    let responseData;

    // Check if the expand query parameter is set to 1
    if (req.query.expand === '1') {
      responseData = {
        status: 'ok',
        fragments: [
          {
            id: 1,
            type: 'text/plain',
            content: 'Sample fragment 1',
            metadata: {
              author: 'user1@email.com',
              creationDate: '2023-01-01T12:00:00Z',
            },
          },
          {
            id: 2,
            type: 'application/json',
            content: '{"key": "value"}',
            metadata: {
              author: 'user1@email.com',
              creationDate: '2023-02-01T12:00:00Z',
            },
          },
        ],
      };
    } else {
      responseData = {
        status: 'ok',
        fragments: [], // Placeholder. Replace with actual data for non-expanded view.
      };
    }

    res.status(200).json(createSuccessResponse(responseData));
  } catch (error) {
    res.status(500).json(createErrorResponse('Internal server error', 500));
  }
};
