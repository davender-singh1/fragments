// tests/unit/get.test.js

const request = require('supertest');

const app = require('../../src/app');

describe('GET /v1/fragments', () => {
  // ... your existing tests ...

  // Test to check if the expand query parameter returns expanded metadata
  test('authenticated users get expanded fragments metadata when using ?expand=1', async () => {
    const res = await request(app)
      .get('/v1/fragments?expand=1')
      .auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(Array.isArray(res.body.fragments)).toBe(true);

    // Checking if the returned data contains the mocked metadata
    expect(res.body.fragments[0]).toHaveProperty('metadata');
    expect(res.body.fragments[0].metadata).toHaveProperty('author', 'user1@email.com');
  });
});
