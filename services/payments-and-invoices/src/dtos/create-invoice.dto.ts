import { IsNotEmpty, IsNumber, IsOptional, IsDateString, IsString, isNotEmpty, isNumber } from 'class-validator';

export class CreateInvoiceDto {
  @IsNotEmpty()
  @IsNumber()
  contract_id!: number;

  @IsNotEmpty()
  @IsNumber()
  property_part_id!: number;

 
  @IsNotEmpty()
  @IsNumber()
  organization_id?: number;

  @IsNotEmpty()
  @IsNumber()
  amount!: number;

  @IsNotEmpty()
  @IsDateString()
  due_date!: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  tenant_name?: string;

  @IsOptional()
  @IsString()
  merchant?: string;

  @IsOptional()
  @IsString()
  frequency?: string;

  @IsOptional()
  @IsString()
  external_id?: string;


  @IsOptional()
  @IsString()
  file_alias_name?: string;


}
