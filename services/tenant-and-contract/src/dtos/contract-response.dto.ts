export interface ContractWithTenantsDto {
    id: number;
    organization_id: number;
    organization_name: string;
    property_id: number;
    property_name: string;
    property_part_id: number;
    property_part_name: string;
    rent_amount: number;
    start_date: Date;
    end_date: Date;
    tds_applicable: boolean;
    isActive: boolean;
    created_at: Date;
    updated_at: Date;
    tenant_ids: number[];
  }
  