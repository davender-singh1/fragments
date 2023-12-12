const passport = require('passport');
const { createErrorResponse } = require('../response');
const hash = require('../hash');
const logger = require('../logger');
/**
 * @param {'bearer' | 'http'} strategyName - the passport strategy to use
 * @returns {Function} - the middleware function to use for authentication
 */
module.exports = (strategyName) => {
  return function (req, res, next) {
    logger.debug(`Authorization Header: ${req.headers.authorization}`);
    function callback(err, email) {
      logger.debug('Callback received', { err, email });
      if (err) {
        logger.warn({ err }, 'Error occurred during authentication');
        return next(createErrorResponse(500, 'Unable to authenticate user'));
      }

      if (!email) {
        logger.debug({ headers: req.headers }, 'Authentication failed: No email provided');
        return res.status(401).json(createErrorResponse(401, 'Unauthorized'));
      }

      req.user = hash(email);
      logger.debug({ email, hash: req.user }, 'Successfully authenticated user');
      next();
    }

    logger.debug({ strategyName, headers: req.headers }, 'Attempting authentication with strategy');
    passport.authenticate(strategyName, { session: false }, callback)(req, res, next);
  };
};
