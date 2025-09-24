import { plainToInstance } from 'class-transformer'
import { validate } from 'class-validator'
import { Request, Response, NextFunction } from 'express'

export function validateDtoArray(dtoClass: any) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const dtoArray = plainToInstance(dtoClass, req.body as object[]) as object[]

    if (!Array.isArray(dtoArray)) {
      res.status(400).json({ message: "Expected an array in request body." })
      return
    }

    for (const [index, dto] of dtoArray.entries()) {
      const errors = await validate(dto)
      if (errors.length > 0) {
        res.status(400).json({
          message: `Validation failed at index ${index}`,
          errors,
        })
        return
      }
    }

    next() // ✅ Important: this tells Express to continue
  }
}
