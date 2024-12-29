import { CustomError } from '../middleware/custom-error';

export class BadRequestError extends CustomError {
  statusCode = 400;

  constructor(public errors: { message: string; field?: string }[]) {
    super("incorrect payload");
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }

  serializeError() {
    return this.errors; // Return the dynamic error array
  }
}
