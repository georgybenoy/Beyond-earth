/**
 * Async handler middleware wrapper to catch errors in Express routes
 * and forward them cleanly to the centralized error handler without boilerplate try/catch.
 * @param {Function} fn - Asynchronous route handler function (req, res, next)
 * @returns {Function} Express middleware function
 */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
