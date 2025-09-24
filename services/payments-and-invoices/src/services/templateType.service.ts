import { AppDataSource } from "../config/AppDataSource";
import { CreateTemplateTypeDto } from "../dtos/template.dto";
import { TemplateType } from "../entities/templates.entity";


export class TemplateTypeService {
  private repo = AppDataSource.getRepository(TemplateType);

  async create(data: CreateTemplateTypeDto): Promise<TemplateType> {
    const type = this.repo.create(data);
    return await this.repo.save(type);
  }

  async getAll(): Promise<TemplateType[]> {
    return await this.repo.find();
  }
  async update(id: number, data: Partial<CreateTemplateTypeDto>) {
    const template = await this.repo.findOneBy({ id });
    if (!template) return null;
    Object.assign(template, data);
    return await this.repo.save(template);
  }

  async getById(id: number) {
    return await this.repo.findOneBy({ id });
  }

  async delete(id: number) {
    const result = await this.repo.delete(id);
    return result.affected !== 0;
  }

 


}
