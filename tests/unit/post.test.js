const request = require('supertest');
const express = require('express');
const postRouter = require('../../src/routes/api/post');
const app = express();

// Mock middleware to add user object to request
// This needs to be before the route it applies to
app.use((req, res, next) => {
  req.user = {
    id: 'mockUserId',
  };
  next();
});

app.use('/v1', postRouter);

describe('POST /v1/fragments', () => {
  it('should return 400 for invalid data format', async () => {
    const response = await request(app).post('/v1/fragments').send('invalid_data');
    expect(response.statusCode).toBe(400);
    expect(response.text).toBe('Invalid data format');
  });
});
