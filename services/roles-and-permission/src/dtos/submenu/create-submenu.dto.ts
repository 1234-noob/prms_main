import { IsString, IsNumber, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { PermissionDto } from '../role/permission.dto';

export class CreateSubmenuDto {
  @IsString()
  name!: string;

  @IsNumber()
  menu_id!: number;

  @IsString()
  path!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PermissionDto)
  permissions!: PermissionDto[];
}
