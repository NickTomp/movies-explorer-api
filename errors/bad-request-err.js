const { INVALID_DATA_ERROR_CODE } = require('../constants/err-codes');

class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = INVALID_DATA_ERROR_CODE;
  }
}

module.exports = BadRequestError;
