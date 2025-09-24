import { Repository } from 'typeorm';
import { AppDataSource } from '../config/AppDataSource';
import { CreateSubmenuDto } from '../dtos/submenu/create-submenu.dto';
import { Menu } from '../entities/menu.entity';
import { Permission } from '../entities/permission.entity';
import { Submenu } from '../entities/submenu.entity';

export class SubmenuService {
  private submenuRepository: Repository<Submenu>;
  private menuRepository: Repository<Menu>;
  private permissionRepository: Repository<Permission>;

  constructor() {
    this.submenuRepository = AppDataSource.getRepository(Submenu);
    this.menuRepository = AppDataSource.getRepository(Menu);
    this.permissionRepository = AppDataSource.getRepository(Permission);
  }

  async findAll(): Promise<Submenu[]> {
    return this.submenuRepository.find({ relations: ['menu', 'permissions'] });
  }

  async findOne(submenu_id: number): Promise<Submenu> {
    const submenu = await this.submenuRepository.findOne({ where: { submenu_id }, relations: ['menu', 'permissions'] });
    if (!submenu) {
      throw new Error(`Submenu with ID ${submenu_id} not found.`);
    }
    return submenu;
  }

  async create(createSubmenuDto: CreateSubmenuDto): Promise<Submenu> {
    const { name, menu_id, path, permissions } = createSubmenuDto;
    
    // Find the associated menu
    const menu = await this.menuRepository.findOne({ where: { menu_id } });
    if (!menu) {
      throw new Error(`Menu with ID ${menu_id} not found.`);
    }

    // Create the submenu entity
    const submenu = this.submenuRepository.create({ name, path, menu });

    // Add permissions if provided
    if (permissions && permissions.length) {
      submenu.permissions = await this.permissionRepository.findByIds(permissions.map(p => p.permission_id));
    }

    // Save the submenu
    return this.submenuRepository.save(submenu);
  }

  async remove(submenu_id: number): Promise<void> {
    const result = await this.submenuRepository.delete(submenu_id);
    if (result.affected === 0) {
      throw new Error(`Submenu with ID ${submenu_id} not found.`);
    }
  }
}
