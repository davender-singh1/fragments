const request = require('supertest');
const app = require('../../src/app'); // Ensure this path is correct for importing your Express app
const { author, version } = require('../../package.json');

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

describe('GET /health', () => {
  it('should respond with 200 OK and correct health data', async () => {
    const response = await request(app).get('/health');

    expect(response.status).toBe(200);
    expect(response.headers['cache-control']).toBe('no-cache');
    expect(response.body).toEqual({
      status: 'ok',
      author,
      githubUrl: 'https://github.com/davender-singh1/fragments',
      version,
    });
  });
});
