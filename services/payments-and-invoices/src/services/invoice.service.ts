import { Organization } from './../../../organization-management/src/entities/organization.entity';

import { Tenant } from './../../../tenant-and-contract/src/entities/tenant.entity';
// src/services/invoice.service.ts



import { AppDataSource } from "../config/AppDataSource";
import { UpdateInvoiceDto } from "../dtos/update-invoice.dto";
import * as fs from 'fs';

import { Invoice } from "../entities/enovices.entity";
import { CreateInvoiceDto } from '../dtos/create-invoice.dto';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { excelDateToIsoString } from '../utils/date.utils';
import { generateReceiptPDF } from './receipt.service';
import { ReceiptDto } from '../dtos/receipt.dto';
import path from 'path';
import { getOrganizationDetails } from '../helpers/organization-client';



export class InvoiceService {
  private invoiceRepo = AppDataSource.getRepository(Invoice);




  async createInvoice(dto: CreateInvoiceDto): Promise<Invoice> {
    // Step 1: Validate DTO
    const dtoInstance = plainToInstance(CreateInvoiceDto, dto);
    const errors = await validate(dtoInstance);

    if (errors.length > 0) {
      const messages = errors
        .map((err) => Object.values(err.constraints || {}))
        .flat();
      const errorMessage = `Validation failed: ${messages.join(', ')}`;
      console.error("❌ Validation error:", errorMessage);
      throw new Error(errorMessage);
    }

    // Step 2: Validate due_date
    const dueDate = new Date(dto.due_date);
    if (isNaN(dueDate.getTime())) {
      const dateErr = 'Invalid due_date format';
      console.error("❌ Date error:", dateErr);
      throw new Error(dateErr);
    }

    // Step 3: Prepare invoice
    const invoice = this.invoiceRepo.create({
      contract_id: dto.contract_id,
      property_part_id: dto.property_part_id,
      amount: dto.amount,
      due_date: dueDate,
      status: dto.status || 'pending',
      tenant_name: dto.tenant_name,
      merchant: dto.merchant,
      frequency: dto.frequency,
      external_id: dto.external_id || 'prms_org_001',
    });

    try {
      // Step 4: Save and return
      return await this.invoiceRepo.save(invoice);
    } catch (error: any) {
      console.error('❌ DB Error while saving invoice:', error.message);
      throw new Error('Failed to save invoice to the database');
    }
  }

  // create invoice with reciept 
  // async createInvoice(dto: CreateInvoiceDto): Promise<Invoice> {
  //   const dtoInstance = plainToInstance(CreateInvoiceDto, dto);
  //   const errors = await validate(dtoInstance);

  //   if (errors.length > 0) {
  //     const messages = errors.map((err) => Object.values(err.constraints || {})).flat();
  //     throw new Error(`Validation failed: ${messages.join(', ')}`);
  //   }

  //   const dueDate = new Date(dto.due_date);
  //   if (isNaN(dueDate.getTime())) {
  //     throw new Error('Invalid due_date format');
  //   }

  //   const invoice = this.invoiceRepo.create({

  //     contract_id: dto.contract_id,
  //     organization_id: dto.organization_id,
  //     property_part_id: dto.property_part_id,
  //     amount: dto.amount,
  //     due_date: dueDate,
  //     status: dto.status || 'pending',
  //     tenant_name: dto.tenant_name,
  //     merchant: dto.merchant,
  //     frequency: dto.frequency,
  //     external_id: dto.external_id || 'prms_org_001',
  //   });

  //   try {
  //     const savedInvoice = await this.invoiceRepo.save(invoice);

  //     // ✅ If status is paid, generate receipt
  //     if (savedInvoice.status === 'paid') {
  //       const organization = await getOrganizationDetails(savedInvoice.organization_id);
  //       const receiptDto: ReceiptDto = {
  //         receiptId: `R-${Date.now()}`,
  //         invoiceId: savedInvoice.id.toString(),
  //         name: savedInvoice.tenant_name || "N/A",
  //         serviceName: savedInvoice.frequency || "Rent",
  //         amount: savedInvoice.amount,
  //         paymentMode: "Cash",
  //         date: new Date().toLocaleDateString(),
  //         orgName: organization.name,
  //         orgAddress: organization.address
  //       };

  //       const buffer = await generateReceiptPDF(receiptDto);

  //       const receiptsDir = path.join(__dirname, "../../receipts");
  //       if (!fs.existsSync(receiptsDir)) {
  //         fs.mkdirSync(receiptsDir, { recursive: true });
  //       }

  //       const filePath = path.join(__dirname, `../../receipts/receipt-${savedInvoice.id}.pdf`);
  //       fs.writeFileSync(filePath, buffer);

  //       // Optionally: save file path or receiptId in DB
  //       savedInvoice.receipt_path = `/api/invoices/receipt/${savedInvoice.id}`; // <- add this column in Invoice entity
  //       await this.invoiceRepo.save(savedInvoice);
  //     }

  //     return savedInvoice;
  //   } catch (error: any) {
  //     console.error('❌ DB Error while saving invoice:', error.message);
  //     throw new Error('Failed to save invoice to the database');
  //   }
  // }


  async fetchInvoices(): Promise<Invoice[]> {
    return await this.invoiceRepo.find(); // add relations if needed
  }





  // async createBulkInvoices(dtoArray: CreateInvoiceDto[]): Promise<Invoice[]> {
  //   const invoices: Invoice[] = [];

  //   for (const dto of dtoArray) {
  //     const dueDate = new Date(dto.due_date);
  //     if (isNaN(dueDate.getTime())) {
  //       throw new Error(`Invalid due_date for contract_id: ${dto.contract_id}`);
  //     }

  //     const invoice = this.invoiceRepo.create({
  //       contract_id: dto.contract_id,
  //       property_part_id: dto.property_part_id,
  //       amount: dto.amount,
  //       due_date: dueDate,
  //       status: dto.status || 'pending',
  //       tenant_name: dto.tenant_name,
  //       merchant: dto.merchant,
  //       frequency: dto.frequency,
  //       external_id: dto.external_id,
  //       bulkUploaded: true,
  //       file_alias_name: dto.file_alias_name, // Add file alias name here
  //     });

  //     invoices.push(invoice);
  //   }

  //   return await this.invoiceRepo.save(invoices);
  // }

  async createBulkInvoices(dtoArray: CreateInvoiceDto[]): Promise<Invoice[]> {
    const invoices: Invoice[] = [];

    for (const dto of dtoArray) {
      let dueDate: Date;

      // Check if due_date is a number (Excel serial date) and convert it
      if (typeof dto.due_date === 'number') {
        // Convert the serial date number to ISO string
        const isoDateString = excelDateToIsoString(dto.due_date);
        dueDate = new Date(isoDateString);
        // Now dueDate is a valid Date object
        console.log('Converted due_date:', excelDateToIsoString(dto.due_date)); // Log the converted date

      } else {
        dueDate = new Date(dto.due_date); // If it's already a string, parse it directly
      }

      // Check if the date is valid
      if (isNaN(dueDate.getTime())) {
        throw new Error(`Invalid due_date for contract_id: ${dto.contract_id}`);
      }

      const invoice = this.invoiceRepo.create({
        contract_id: dto.contract_id,
        property_part_id: dto.property_part_id,
        amount: dto.amount,
        due_date: dueDate, // Ensure it's a valid Date object
        status: dto.status || 'pending',
        tenant_name: dto.tenant_name,
        merchant: dto.merchant,
        frequency: dto.frequency,
        external_id: dto.external_id || 'prms_org_001',
        bulkUploaded: true,
        file_alias_name: dto.file_alias_name,
      });

      invoices.push(invoice);
    }

    return await this.invoiceRepo.save(invoices);
  }








  // async updateInvoice(id: number, dto: UpdateInvoiceDto) {
  //   const invoice = await this.invoiceRepo.findOne({ where: { id } });
  //   if (!invoice) return null;

  //   Object.assign(invoice, dto);
  //   return await this.invoiceRepo.save(invoice);
  // }



  async updateInvoice(id: number, dto: UpdateInvoiceDto): Promise<Invoice | null> {
    const invoice = await this.invoiceRepo.findOne({ where: { id } });
    if (!invoice) return null;

    // Validate DTO (optional, if you're not already validating via middleware)
    const dtoInstance = plainToInstance(UpdateInvoiceDto, dto);
    const errors = await validate(dtoInstance);
    if (errors.length > 0) {
      const messages = errors.map((err) => Object.values(err.constraints || {})).flat();
      throw new Error(`Validation failed: ${messages.join(', ')}`);
    }

    const previousStatus = invoice.status;

    // Update invoice fields
    Object.assign(invoice, dto);

    const updatedInvoice = await this.invoiceRepo.save(invoice);

    // ✅ If newly marked as "paid", generate receipt
    if (dto.status === 'paid' && previousStatus !== 'paid') {
      try {
        const organization = await getOrganizationDetails(updatedInvoice.organization_id);

        const receiptDto: ReceiptDto = {
          receiptId: `R-${Date.now()}`,
          invoiceId: updatedInvoice.id.toString(),
          name: updatedInvoice.tenant_name || "N/A",
          serviceName: updatedInvoice.frequency || "Rent",
          amount: updatedInvoice.amount,
          paymentMode: "Cash",
          date: new Date().toLocaleDateString(),
          orgName: organization.name,
          orgAddress: organization.address
        };

        const buffer = await generateReceiptPDF(receiptDto);

        const receiptsDir = path.join(__dirname, "../../receipts");
        if (!fs.existsSync(receiptsDir)) {
          fs.mkdirSync(receiptsDir, { recursive: true });
        }

        const filePath = path.join(receiptsDir, `receipt-${updatedInvoice.id}.pdf`);
        fs.writeFileSync(filePath, buffer);

        updatedInvoice.receipt_path = `/api/invoices/receipt/${updatedInvoice.id}`;
        await this.invoiceRepo.save(updatedInvoice);
      } catch (error: any) {
        console.error("❌ Error generating receipt during update:", error.message);
      }
    }

    return updatedInvoice;
  }



  async deleteInvoice(id: number): Promise<boolean> {
    const result = await this.invoiceRepo.delete(id);
    return result.affected !== 0;
  }

  async fetchInvoiceById(id: number): Promise<Invoice | null> {
    return await this.invoiceRepo.findOne({ where: { id } });
  }




}
