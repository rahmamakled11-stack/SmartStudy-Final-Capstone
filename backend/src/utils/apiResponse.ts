import { Response } from 'express';

export const sendSuccess = (
  res: Response,
  data: any,
  message: string = 'Success',
  statusCode: number = 200,
  meta?: any
) => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
    ...(meta && { meta }),
  });
};

export const sendError = (
  res: Response,
  message: string,
  statusCode: number = 500,
  errors?: any[]
) => {
  res.status(statusCode).json({
    success: false,
    message,
    ...(errors && { errors }),
  });
};
