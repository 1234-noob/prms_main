import { IsNumber } from 'class-validator';

export class PermissionDto {
  @IsNumber()
  permission_id!: number;
}
