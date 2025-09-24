// middlewares/validate.ts
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { Request, Response, NextFunction } from 'express';

export function validateDto(type: any) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const dtoObject = plainToInstance(type, req.body);
    const errors = await validate(dtoObject);

    if (errors.length > 0) {
      const messages = errors
        .map(err => Object.values(err.constraints || {}))
        .flat();

      res.status(400).json({ message: 'Validation failed', errors: messages });
      return; // <-- Important: exit early without returning res
    }

    return next();
  };
}
