class ServerError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 500; // ERROR_DEFAULT
  }
}

module.exports = ServerError;
