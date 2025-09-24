import { IsString, IsArray, ValidateNested, IsInt } from 'class-validator';
import { Type } from 'class-transformer';
import { PermissionDto } from './permission.dto';

export class CreateRoleDto {
  @IsString()
  role_name!: string;

  @IsInt()
  role_id!: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PermissionDto)
  permissions!: PermissionDto[];
}
