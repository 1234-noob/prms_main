export interface TenantPropertyPartDto {
    id: number;
    organization_id: number;
    organization_name: string;
    property_id: number;
    property_name: string;
    property_part_id: number;
    property_part_name: string;
    isActive: boolean;
    created_at: Date;
    updated_at: Date;
  }
  
  export interface TenantWithMappingsDto {
    id: number;
    name: string;
    contact: string;
    email: string;
    isActive: boolean;
    created_at: Date;
    updated_at: Date;
    mappings: TenantPropertyPartDto[];
    contracts?: ContractSummaryDto[]; // if includeContracts=true
  }
  
  // lightweight contract summary
  export interface ContractSummaryDto {
    contract_id: number;
    property_id: number;
    property_name: string;
    property_part_id: number;
    property_part_name: string;
    organization_id: number;
    organization_name: string;
    rent_amount: number;
    start_date: Date;
    end_date: Date;
    isActive: boolean;
  }
  