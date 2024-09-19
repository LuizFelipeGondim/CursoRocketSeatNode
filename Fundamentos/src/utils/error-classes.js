export class NotFoundError extends Error {
  constructor(message) {
      super(message);
      this.statusCode = 404;
  }
}

export class BadRequestError extends Error {
  constructor(message) {
      super(message);
      this.statusCode = 400;
  }
}