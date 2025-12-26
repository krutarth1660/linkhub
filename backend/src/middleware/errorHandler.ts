import { Request, Response, NextFunction } from 'express'
import { ZodError } from 'zod'

export interface AppError extends Error {
  statusCode?: number
  isOperational?: boolean
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let error = { ...err }
  error.message = err.message

  // Log error
  console.error(err)

  // Zod validation error
  if (err instanceof ZodError) {
    const message = err.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')
    error.message = message
    error.statusCode = 400
  }

  // Prisma errors
  if (err.message.includes('Unique constraint')) {
    error.message = 'Resource already exists'
    error.statusCode = 409
  }

  if (err.message.includes('Record to update not found')) {
    error.message = 'Resource not found'
    error.statusCode = 404
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  })
}