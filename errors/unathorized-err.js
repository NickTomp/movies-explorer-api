const { UNATHORIZED_ERROR_CODE } = require('../constants/err-codes');

class UnathorizedError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = UNATHORIZED_ERROR_CODE;
  }
}

module.exports = UnathorizedError;
