import { HttpError } from 'http-errors'
import { v4 as uuidv4 } from 'uuid'
import { NextFunction, Request, Response } from 'express'
import logger from '../config/logger'

export const globalErrorHandler = (
  err: HttpError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
) => {
  const isProduction = process.env.NODE_ENV === 'production'
  const statusCode = err.status || err.statusCode || 500
  const errorId = uuidv4()
  const message = isProduction ? 'Internal server error' : err.message

  logger.error(err.message, {
    id: errorId,
    status: statusCode,
    message: err.message,
    path: req.path,
    method: req.method,
  })

  res.status(statusCode).json({
    errors: [
      {
        id: errorId,
        type: err.name,
        message: isProduction ? message : err.message,
        statusCode,
        path: req.path,
        method: req.method,
        stack: isProduction ? null : err.stack,
        location: 'server',
      },
    ],
  })
}
