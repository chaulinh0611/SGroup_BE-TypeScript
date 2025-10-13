import { Request, Response } from 'express';

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

export const errorHandler = (err: any, req: Request, res: Response) => {
  console.error('🔥 Error:', err);

  if (err instanceof HttpException) {
    return res.status(err.status).json({
      success: false,
      code: err.code,
      message: err.message,
    });
  }

  return res.status(500).json({
    success: false,
    code: 'INTERNAL_ERROR',
    message: err.message || 'Something went wrong!',
  });
};
