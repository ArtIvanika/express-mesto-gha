class BadRequest extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 400; // ERROR_INCORRECT_DATA
  }
}

module.exports = BadRequest;
