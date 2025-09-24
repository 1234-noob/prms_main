// src/roles/dto/role-with-permissions.dto.ts

import { Permission } from "../../entities/permission.entity";


export class RoleWithPermissionsDto {
  role_id!: number;
  role_name!: string;
  permissions!: Permission[]; // Ensure permissions match the Permission entity structure
}
