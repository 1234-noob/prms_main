export class CreatePropertyDto {
  organization_id!: number;
  name!: string;
  organization_name!: string;
  location?: string;
  splitable!: boolean;     // required
  // isActive omitted (defaults to true)
}
