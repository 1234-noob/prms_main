export class CreatePropertyPartDto {
  property_id!: number;
  part_name!: string;
  status?: "Available" | "Rented";
  // isActive omitted (defaults to true)
}
