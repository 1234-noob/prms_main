// src/permission/permissions.service.ts
import { Repository } from 'typeorm';
import { Permission } from '../entities/permission.entity';
import { AppDataSource } from '../config/AppDataSource';
import { CreatePermissionDto } from '../dtos/permission/create-permission.dto';
import { UpdatePermissionDto } from '../dtos/permission/update-permission.dto';


export class PermissionService {
  private permissionRepository: Repository<Permission>;

  constructor() {
    this.permissionRepository = AppDataSource.getRepository(Permission);
  }

  async create(createPermissionDto: CreatePermissionDto): Promise<Permission> {
    const permission = this.permissionRepository.create(createPermissionDto);
    return this.permissionRepository.save(permission);
  }

  async findAll(): Promise<Permission[]> {
    return this.permissionRepository.find();
  }

  async update(permission_id: number, updatePermissionDto: UpdatePermissionDto): Promise<Permission | null> {
    await this.permissionRepository.update(permission_id, updatePermissionDto);
    return this.permissionRepository.findOne({where  :{permission_id}});
  }

  async remove(permission_id: number): Promise<void> {
    await this.permissionRepository.delete(permission_id);
  }
}
