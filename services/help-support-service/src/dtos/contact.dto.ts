
import { IsInt, IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateContactDto {
    @IsInt()
    tenantId?: number;

    @IsInt()
    unit?: number;

    @IsInt()
    propertyId?: number;

    @IsString()
    @IsNotEmpty()
    reason?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsString()
    @IsOptional()
    status?: string;

    @IsString()
    @IsNotEmpty()
    external_id?: string;
}

