import { Request, Response, NextFunction } from 'express';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

export function validateDto(dtoClass: any) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Ensure req.body is not null or undefined
      if (!req.body) {
        return res.status(400).json({
          message: 'Request body is missing',
        });
      }

      // Transform the incoming plain object into an instance of the DTO class
      const dtoObject = plainToInstance(dtoClass, req.body);

      // Validate the transformed object with class-validator
      const errors = await validate(dtoObject, { whitelist: true, forbidNonWhitelisted: true });

      // If there are validation errors, format and send a response with error details
      if (errors.length > 0) {
        const formattedErrors = errors.map((err) => ({
          field: err.property,
          message: Object.values(err.constraints || {}).join(', '),
        }));

        return res.status(400).json({
          message: 'Validation failed',
          errors: formattedErrors,
        });
      }

      // Attach the validated DTO back to the request body for further use
      req.body = dtoObject;
      next(); // Proceed to the next middleware or route handler
    } catch (err) {
      // Handle any unexpected errors gracefully
      console.error('Validation Middleware Error:', err);

      // If the error is an instance of Error, use its message, else return a generic message
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';

      return res.status(500).json({
        message: 'Internal Server Error',
        error: errorMessage,
      });
    }
  };
}

