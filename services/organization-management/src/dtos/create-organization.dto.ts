export class CreateOrganizationDto {
  name!: string;
  address?: string;
  email?: string;
  contactNo?: string;
  // no isActive here: it will default to true in the database
}
