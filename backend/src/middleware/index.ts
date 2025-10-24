import express from 'express';
import cors from 'cors';
import { ResponseHandler } from '../utils/response';

export const corsMiddleware = cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
});

export const jsonMiddleware = express.json();

export const errorHandler = (err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  ResponseHandler.internalError(res, 'Internal server error', err);
};

export const notFoundHandler = (req: express.Request, res: express.Response) => {
  ResponseHandler.notFound(res, `Route ${req.originalUrl} not found`);
};
