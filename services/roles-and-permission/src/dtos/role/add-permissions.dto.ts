import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { PermissionDto } from './permission.dto';

export class AddPermissionsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PermissionDto)
  permissions!: PermissionDto[];
}
