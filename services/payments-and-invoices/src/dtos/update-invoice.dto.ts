// export class UpdateInvoiceDto {
//   contract_id?: number;
//   property_part_id?: number;
//   amount?: number;
//   due_date?: Date;
//   status?: string;
//   tenant_name?: string;
//   merchant?: string;
//   freuency?: string;
//   external_id?: string;
// }

import { IsOptional, IsNumber, IsDateString, IsString } from 'class-validator';

export class UpdateInvoiceDto {
  @IsOptional()
  @IsNumber()
  contract_id?: number;

  @IsOptional()
  @IsNumber()
  property_part_id?: number;

  @IsOptional()
  @IsNumber()
  amount?: number;

  @IsOptional()
  @IsDateString()
  due_date?: string;

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
  @IsNumber()
  organization_id?: number;
}

