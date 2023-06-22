class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 404; // ERROR_INCORRECT_DATA
  }
}

module.exports = NotFoundError;
