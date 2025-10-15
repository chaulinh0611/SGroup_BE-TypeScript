import { Request, Response, NextFunction } from 'express';

export class HttpException extends Error {
  status: number;
  code: string;
  message: string;

  constructor(status: number, code: string, message: string) {
    super(message);
    this.status = status;
    this.code = code;
    this.message = message;
  }
}

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('❌ Error:', err);

  if (err instanceof HttpException) {
    return res.status(err.status).json({
      code: err.code,
      message: err.message,
    });
  }

  return res.status(500).json({
    code: 'INTERNAL_SERVER_ERROR',
    message: 'Something went wrong.',
  });
};
