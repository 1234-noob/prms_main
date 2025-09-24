import { Type } from 'class-transformer';
import { IsInt, IsString, IsIn, IsNotEmpty, isString, IsOptional, IsDefined, IsDate } from 'class-validator';

export class CreateDisputeDto {
    @IsInt()
    tenantId?: number;

    @IsInt()
    invoiceId?: number;

    @IsString()
    @IsNotEmpty()
    reason?: string;

    // @IsString()
    filePath?: string;


    @IsOptional()
    @Type(() => Date)  
    @IsDate()
    submissionDate?: Date;

    @IsString()
    @IsNotEmpty()
    external_id?: string;


    @IsString()
    @IsNotEmpty()
    @IsIn(['pending', 'resolved', 'rejected'])
    status?: string;
}

export class UpdateDisputeStatusDto {


    @IsString()
    @IsIn(['pending', 'resolved', 'rejected'])
    status?: string;
}

export class UpdateDisputeDto {

    @IsInt()
    @IsDefined()  // Ensure the tenantId is defined when provided
    tenantId?: number;

    @IsInt()
    @IsDefined()  // Ensure the invoiceId is defined when provided
    invoiceId?: number;

    @IsString()
    @IsNotEmpty()
    reason?: string;

    @IsString()
    @IsOptional()  // Optional but should be a string if present
    filePath?: string;


    @IsOptional()
    @Type(() => Date) 
    @IsDate()
    submissionDate?: Date;

    @IsString()
    @IsOptional()  // Optional but should be a string if present
    external_id?: string;

    @IsString()
    @IsIn(['pending', 'resolved', 'rejected'])
    @IsDefined()  // Ensure the status is defined
    status?: string;
}

