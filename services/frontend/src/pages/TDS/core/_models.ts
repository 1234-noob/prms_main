export interface Contract {
    id: number,
    organization_id: number,
    property_id: number,
    property_name: string,
    property_part_id: number,
    property_part_name: string,
    tenant_ids: number[],
    tenant_id: number,
    contact: string,
    rent_amount: number,
    start_date: Date,
    end_date: Date,
    tds_applicable: boolean,
    email: string,
    tenants: Tenants[]
}

export interface Tenants {
    id: number,
    name: string,
    email: string
}