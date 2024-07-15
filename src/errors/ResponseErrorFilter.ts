import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpStatus,
  } from '@nestjs/common';
  import { Response } from 'express';
  @Catch()
  export class CustomExceptionFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
      const ctx = host.switchToHttp();
      const res = ctx.getResponse<Response>();
  
      const status = HttpStatus.INTERNAL_SERVER_ERROR;
      const message = 'Internal server error';
  
      if (exception.code && exception.message) {
        res.status(exception.code).json({
          message: exception.message,
          errorCode: exception.errorCode,
        });
      } else {
        res.status(status).json({
          statusCode: status,
          message,
        });
      }
    }
  }
  