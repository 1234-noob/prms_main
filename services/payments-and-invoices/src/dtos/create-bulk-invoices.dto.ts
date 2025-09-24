import { IsNotEmpty, IsString, IsArray } from 'class-validator';
import { CreateInvoiceDto } from './create-invoice.dto';  // Import your CreateInvoiceDto

export class CreateBulkInvoicesDto  {
  @IsNotEmpty()
  @IsString()
  file_alias_name!: string;  // The file alias name to be applied to all invoices

  @IsArray()
  invoices!: CreateInvoiceDto[];  // Array of invoices to be created
}