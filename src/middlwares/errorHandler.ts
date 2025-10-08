import { Request, Response } from 'express';
import { HttpException } from '../exceptions/HttpException';

export function errorHandler(err: any, req: Request, res: Response) {
  console.error('[Error]', err);

  if (err instanceof HttpException) {
    return res.status(err.status).json({
      code: err.code,
      message: err.message,
    });
  }
  res.status(500).json({
    code: 'INTERNAL_SERVER_ERROR',
    message: 'Something went wrong',
  });
}
