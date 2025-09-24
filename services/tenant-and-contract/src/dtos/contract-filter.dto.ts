export class ContractFilterDto {
    // only one of these may be used at a time:
    organization_id?: number;
    property_id?: number;
    property_part_id?: number;
  
    isActive?: boolean;
    tds_applicable?: boolean;
    tenant_id?: number;            // filter by tenant on the contract
  
    // date‐range on contract period:
    startDate?: string;            // ISO date
    endDate?: string;              // ISO date
  
    createdAfter?: string;
    updatedAfter?: string;
  }
  