// src/dtos/create-tenantPropertyPart.dto.ts
export class CreateTenantPropertyPartDto {
    tenant_id!: number;
  
    // NEW snapshots:
    organization_id!: number;
    organization_name!: string;
  
    property_id!: number;
    property_name!: string;
  
    property_part_id!: number;
    property_part_name!: string;
  }
  