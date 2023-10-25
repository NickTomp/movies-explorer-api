const { DUPLICATE_ERROR_CODE } = require('../constants/err-codes');

class DuplicateError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = DUPLICATE_ERROR_CODE;
  }
}
module.exports = DuplicateError;
