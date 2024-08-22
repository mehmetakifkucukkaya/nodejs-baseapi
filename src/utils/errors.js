class APIError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.status = statusCode || 400;
  }
}

module.exports = APIError;
