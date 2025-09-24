export class UpdateTdsDto {
    tenant_id?: number;
    tenant_name!: string;    
    organization_id?: number;
    organization_name?: string;
    property_id?: number;
    property_name?: string;
    property_part_id?: number;
    property_part_name?: string;
  
    tds_amount?: number;
    date_submitted?: Date;
    challan_number?: string;
    tds_reference_number?: string;
    receipt_url?: string;
  }
  