const pino = require('pino');

// Use `info` as our standard log level if not specified
const logLevel = process.env.LOG_LEVEL || 'info';

// Configuration for pretty-printing logs
const prettyPrintConfig = {
  colorize: true,
  translateTime: 'SYS:standard',
  ignore: 'pid,hostname',
};

// Setup options for Pino logger
const options = {
  level: logLevel,
  prettyPrint: logLevel === 'debug' ? prettyPrintConfig : false,
};

// Create and export a Pino Logger instance
const logger = pino(options);

module.exports = logger;
