import { Response } from 'express';

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  statusCode: number;
}

export class ResponseHandler {
  static success<T>(res: Response, data: T, message: string = 'Success', statusCode: number = 200): void {
    const response: ApiResponse<T> = {
      success: true,
      message,
      data,
      statusCode
    };
    res.status(statusCode).json(response);
  }

  static error(res: Response, message: string, statusCode: number = 500, error?: any): void {
    const response: ApiResponse = {
      success: false,
      message,
      error: error?.message || error,
      statusCode
    };
    res.status(statusCode).json(response);
  }

  static badRequest(res: Response, message: string = 'Bad Request'): void {
    this.error(res, message, 400);
  }

  static unauthorized(res: Response, message: string = 'Unauthorized'): void {
    this.error(res, message, 401);
  }

  static forbidden(res: Response, message: string = 'Forbidden'): void {
    this.error(res, message, 403);
  }

  static notFound(res: Response, message: string = 'Not Found'): void {
    this.error(res, message, 404);
  }

  static internalError(res: Response, message: string = 'Internal Server Error', error?: any): void {
    this.error(res, message, 500, error);
  }
}
