import { Repository, FindOneOptions } from 'typeorm';
import { AppDataSource } from '../config/AppDataSource';
import { CreateRoleDto } from '../dtos/role/create-role.dto';
import { RemovePermissionDto } from '../dtos/role/remove-permission.dto';
import { RoleWithPermissionsDto } from '../dtos/role/role-with-permissions.dto';
import { Permission } from '../entities/permission.entity';
import { Role } from '../entities/role.entity';
import { ResponseDto } from '../dtos/response.dto';

export class RoleService {
  private roleRepository: Repository<Role>;
  private permissionRepository: Repository<Permission>;

  constructor() {
    this.roleRepository = AppDataSource.getRepository(Role);
    this.permissionRepository = AppDataSource.getRepository(Permission);
  }

  async findAll(): Promise<ResponseDto> {
    const response = new ResponseDto();
    try {
      const roles = await this.roleRepository.find();
      response.success = true;
      response.data = roles;
    } catch (error) {
      response.success = false;
      response.message = `Failed to fetch roles: ${error}`;
    }
    return response;
  }


  async findOne(role_id: number): Promise<Role | null> {
    const options: FindOneOptions<Role> = {
      where: { role_id }, relations: ['permissions'] 
    };
    return await this.roleRepository.findOne(options);
  }

  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    const { permissions, ...roleData } = createRoleDto;
    const role = this.roleRepository.create(roleData);

    if (permissions && permissions.length) {
      const permissionEntities = await this.permissionRepository.findByIds(permissions.map(p => p.permission_id));
      role.permissions = permissionEntities;
    }

    return this.roleRepository.save(role);
  }

  // async update(role_id: number, updateRoleDto: UpdateRoleDto): Promise<Role> {
  //   const { permissions, ...roleData } = updateRoleDto;

  //   if (permissions && permissions.length) {
  //     const role = await this.roleRepository.findOne({
  //       where: { role_id },
  //       relations: ['permission'],
  //     });
  //     role.permissions = await this.permissionRepository.findByIds(permissions);
  //     Object.assign(role, roleData);
  //     return this.roleRepository.save(role);
  //   } else {
  //     await this.roleRepository.update(role_id, roleData);
  //     return this.roleRepository.findOne({ where: { role_id } });
  //   }
  // }

  async addPermissions(role_id: number, permissions: number[]): Promise<Role> {
    const role = await this.roleRepository.findOne({ where: { role_id: role_id }, relations: ['permissions'] });

    if (!role) {
      throw new Error(`Role with ID ${role_id} not found.`);
    }

    const newPermissions = await this.permissionRepository.findByIds(permissions);
    role.permissions = [...role.permissions, ...newPermissions];

    return this.roleRepository.save(role);
  }

  async remove(id: number): Promise<void> {
    await this.roleRepository.delete(id);
  }

  async assignPermissionsToRole(role_id: number, permissionIds: number[]): Promise<Role> {
    const role = await this.roleRepository.findOne({
      where: { role_id }});
    if (!role) {
      throw new Error(`Role with the ID ${role_id} not found`);
    }

    const permissions = await this.permissionRepository.findByIds(permissionIds);
    role.permissions = permissions;
    
    return this.roleRepository.save(role);
  }

  async findAllWithPermissions(): Promise<RoleWithPermissionsDto[]> {
    const roles = await this.roleRepository
      .createQueryBuilder('role')
      .leftJoinAndSelect('role.permissions', 'permission')
      .getMany();

    return roles.map(role => ({
      role_id: role.role_id,
      role_name: role.role_name,
      permissions: role.permissions, // Ensure permissions match the Permission entity structure
    }));
  }

  async removePermissionFromRole(removePermissionDto: RemovePermissionDto): Promise<Role> {
    const { role_id, permission_id } = removePermissionDto;

    const role = await this.roleRepository.findOne({ where: { role_id }, relations: ['permissions'] });
    if (!role) {
      throw new Error(`Role with ID ${role_id} not found.`);
    }

    const permission = await this.permissionRepository.findOne({ where: { permission_id } });
    if (!permission) {
      throw new Error(`Permission with ID ${permission_id} not found.`);
    }

    role.permissions = role.permissions.filter(p => p.permission_id !== permission_id);
    return this.roleRepository.save(role);
  }

  
}
