const { PERMISSION_ERROR_CODE } = require('../constants/err-codes');

class PermissionError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = PERMISSION_ERROR_CODE;
  }
}

module.exports = PermissionError;
