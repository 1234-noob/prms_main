export class TenantFilterDto {
    // Only one of these three may be set at a time:
    organization_id?: number;
    property_id?: number;
    property_part_id?: number;
  
    isActive?: boolean;            // mapping active flag
    createdAfter?: string;         // ISO date, filter mapping.created_at ≥ this
    includeContracts?: boolean;    // whether to fetch associated contracts
    contract_id?: number;          // filter tenants by a specific contract
  
    // NOTE: all fields are optional
  }
  