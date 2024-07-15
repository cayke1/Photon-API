import { HttpStatus } from '@nestjs/common';

export interface CustomError extends Error {
  code: number;
}
export function createCustomError(code: number, description: string) {
  return class CustomError extends Error {
    public code: number;
    public errorCode: string;
    constructor(message?: string, errorCode?: string) {
      super(description);
      this.code = code;
      if (errorCode) this.errorCode = errorCode;
      if (message) this.message = message;
    }
  };
}

export const UnauthorizedError = createCustomError(
  HttpStatus.UNAUTHORIZED,
  'Unauthorized',
);
export const ConflictError = createCustomError(HttpStatus.CONFLICT, 'Conflict');
export const ForbiddenError = createCustomError(
  HttpStatus.FORBIDDEN,
  'Forbidden',
);
export const NotFoundError = createCustomError(
  HttpStatus.NOT_FOUND,
  'Not Found',
);
export const BadRequestError = createCustomError(
  HttpStatus.BAD_REQUEST,
  'Bad Request',
);
