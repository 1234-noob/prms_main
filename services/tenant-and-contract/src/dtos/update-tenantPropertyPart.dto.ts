// src/dtos/update-tenantPropertyPart.dto.ts
export class UpdateTenantPropertyPartDto {
    // If you ever want to change the tenant or the snapshot data, include those here:
    tenant_id?: number;
    organization_id?: number;
    organization_name?: string;
    property_id?: number;
    property_name?: string;
    property_part_id?: number;
    property_part_name?: string;
  
    // ── NEW: toggle mapping active/inactive
    isActive?: boolean;
  }
  