// remove-permission.dto.ts
import { IsInt } from 'class-validator';

export class RemovePermissionDto {
  @IsInt()
  role_id!: number;

  @IsInt()
  permission_id!: number;
}
