import { Repository } from 'typeorm';
import { Menu } from '../entities/menu.entity';
import { CreateMenuDto } from '../dtos/menu/create-menu.dto';
import { UpdateMenuDto } from '../dtos/menu/update-menu.dto';
import { AppDataSource } from '../config/AppDataSource';

export class MenuService {
  private menuRepository: Repository<Menu>;

  constructor() {
    this.menuRepository = AppDataSource.getRepository(Menu);
  }

  async findAll(): Promise<Menu[]> {
    return this.menuRepository.find({ relations: ['submenus'] });
  }

  async findOne(menu_id: number): Promise<Menu> {
    const menu = await this.menuRepository.findOne({ where: { menu_id }, relations: ['submenus'] });
    if (!menu) {
      throw new Error(`Menu with ID ${menu_id} not found.`);
    }
    return menu;
  }

  async create(createMenuDto: CreateMenuDto): Promise<Menu | null> {
    const menu = this.menuRepository.create(createMenuDto);
    await this.menuRepository.save(menu); // Save the menu first to get the menu_id

    // Fetch the menu with populated submenus
    return this.menuRepository.findOne({ where: { menu_id: menu.menu_id }, relations: ['submenus'] });
  }
  
  async update(menu_id: number, updateMenuDto: UpdateMenuDto): Promise<Menu | null> {
    const existingMenu = await this.menuRepository.findOne({ where: { menu_id } });
    if (!existingMenu) {
      throw new Error(`Menu with ID ${menu_id} not found.`);
    }

    // Update only specified properties
    if (updateMenuDto.name) {
      existingMenu.name = updateMenuDto.name;
    }
    if (updateMenuDto.path) {
      existingMenu.path = updateMenuDto.path;
    }

    // Update menu_id if explicitly provided (consider implications in your database)
    if (updateMenuDto.menu_id) {
      existingMenu.menu_id = updateMenuDto.menu_id;
    }

    await this.menuRepository.save(existingMenu);

    // Fetch the updated menu with populated submenus
    return this.menuRepository.findOne({ where: { menu_id }, relations: ['submenus'] });
  }
  

  async remove(menu_id: number): Promise<void> {
    const result = await this.menuRepository.delete(menu_id);
    if (result.affected === 0) {
      throw new Error(`Menu with ID ${menu_id} not found.`);
    }
  }

}
