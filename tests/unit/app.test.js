const request = require('supertest');
const app = require('../../src/app'); // Ensure this path is correct for importing your Express app

describe('App tests', () => {
  describe('404 handler', () => {
    it('should return a 404 for non-existent routes', async () => {
      const response = await request(app).get('/non-existent-route');

      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        status: 'error',
        error: {
          message: 'not found',
          code: 404,
        },
      });
    });
  });
});
