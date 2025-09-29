import { IsString, IsOptional, IsNumber, IsObject } from "class-validator";

export class ErrorLogDto {
  @IsString()
  origin!: string;

  @IsString()
  message!: string;

  @IsOptional()
  @IsString()
  stack?: string;

  @IsNumber()
  statusCode: number;

  @IsOptional()
  @IsObject()
  metadata?: any;
}
