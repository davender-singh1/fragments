const pino = require('pino');

// Use `info` as our standard log level if not specified
const logLevel = process.env.LOG_LEVEL || 'info';

// Define the options object
let options = {
  level: logLevel,
};

// If we're doing `debug` logging, make the logs easier to read
if (options.level === 'debug') {
  // https://github.com/pinojs/pino-pretty
  options.transport = {
    target: 'pino-pretty',
    options: {
      colorize: true,
    },
  };
}

// Create and export a Pino Logger instance:
// https://getpino.io/#/docs/api?id=logger
module.exports = pino(options);
