export class CreateContractDto {
  tenant_ids!: number[];
    property_id!: number;
    property_part_id?: number;
    rent_amount!: number;
    start_date!: Date;
    end_date!: Date;
    tds_applicable!: boolean;
    property_name!: string;
    property_part_name!: string;
    organization_id!: number;
    organization_name!: string;
  }
  