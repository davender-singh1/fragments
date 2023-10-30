const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const passport = require('passport');
const fragmentsRoute = require('./routes/api/post');

const { author, version } = require('../package.json');

const logger = require('./logger');
const pino = require('pino-http')({
  logger,
});
const authenticate = require('./auth');
const { createErrorResponse } = require('./response');

const app = express();

app.use(pino);
app.use(helmet());
app.use(
  cors({
    origin: 'http://localhost:1234', // or your frontend's origin
    credentials: true,
  })
);
app.use(compression());

passport.use(authenticate.strategy());
app.use(passport.initialize());
app.use(fragmentsRoute);

// Define specific routes first
app.use('/', require('./routes'));

// Health check route - should be defined specifically, not with a catch-all middleware
app.get('/health', (req, res) => {
  res.setHeader('Cache-Control', 'no-cache');
  res.status(200).json({
    status: 'ok',
    author,
    githubUrl: 'https://github.com/davender-singh1/fragments',
    version,
  });
});

// 404 middleware should come before the general error handler,
// so it can handle any requests that haven't been handled by earlier routes or middlewares.
// eslint-disable-next-line no-unused-vars
app.use((req, res, next) => {
  console.log('Inside 404 middleware');
  res.status(404).json({
    status: 'error',
    error: {
      message: 'not found',
      code: 404,
    },
  });
});

// General error handler should come after the 404 middleware
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'unable to process request';

  if (status > 499) {
    logger.error({ err }, `Error processing request`);
  }

  res.status(status).json(createErrorResponse(message, status));
});

module.exports = app;
