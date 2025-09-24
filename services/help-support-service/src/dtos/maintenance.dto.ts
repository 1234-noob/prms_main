import { IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateMaintenanceDto {
    @IsInt()
    @IsNotEmpty()
    unit?: number;

    @IsInt()
    @IsNotEmpty()
    propertyId?: number;

    @IsInt()
    @IsNotEmpty()
    TenantId?: number;

    @IsString()
    @IsOptional()
    description?: string;

    @IsString()
    @IsNotEmpty()
    issueType?: string;

}

export class UpdateMaintenanceDto {
    @IsInt()
    @IsNotEmpty()
    unit?: number;

    @IsInt()
    @IsNotEmpty()
    propertyId?: number;

    @IsInt()
    @IsNotEmpty()
    TenantId?: number;

    @IsString()
    @IsOptional()
    description?: string;

    @IsString()
    @IsNotEmpty()
    issueType?: string;
}