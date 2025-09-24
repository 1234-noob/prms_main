export interface Unit {
    id: number,
    property_id: number,
    part_name: string,
    property_name?: string,
    location: string,
    status: UnitStatus,
}

export enum UnitStatus {
    Available = "Available",
    Rented = "Rented",
}