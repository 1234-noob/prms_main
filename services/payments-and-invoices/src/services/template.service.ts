import { Template } from './../../../frontend/src/pages/Invoices/core/_model';
import { AppDataSource } from "../config/AppDataSource";
import { CreateTemplateDto } from "../dtos/template.dto";
import { Templates } from "../entities/receipt_template.entity";
import { TemplateCode } from '../utils/template.uitls';
import { TemplateType } from '../entities/templates.entity';
import { Raw } from 'typeorm';


export class TemplateService {
  private repo = AppDataSource.getRepository(Templates);
  private templateTyperepo = AppDataSource.getRepository(TemplateType);

  async create(data: CreateTemplateDto): Promise<Templates> {
    // await this.repo.update({ organization_id: data.organization_id }, { is_active: false });

    const newTemplate = this.repo.create({ ...data, is_active: true });
    return await this.repo.save(newTemplate);
  }

  async getById(id: number): Promise<Templates | null> {
    return await this.repo.findOne({ where: { id } });
  }

  async update(id: number, data: Partial<CreateTemplateDto>): Promise<Templates | null> {
    const template = await this.repo.findOne({ where: { id } });
    if (!template) return null;

    this.repo.merge(template, data);
    return await this.repo.save(template);
  }

  // async fetchActiveByOrganizationId(organizationId: number): Promise<Templates | null> {
  //   return await this.repo.findOne({
  //     where: { organization_id: organizationId, is_active: true },
  //     relations: { template_type: true },
  //   });
  // }
  async fetchActiveByOrgAndType(orgId: number, code: TemplateCode): Promise<Templates | null> {
    // case-insensitive lookup of TemplateType.type

    const ttype = await this.templateTyperepo.findOne({
      where: {
        type: Raw((alias) => `LOWER(${alias}) = LOWER(:code)`, { code }),
      },
    });
    // console.log(ttype);
    if (!ttype) return null;

    return this.repo.findOne({
      where: {
        organization_id: orgId,
        is_active: true,
        template_type_id: ttype.id,
      },
      relations: { template_type: true },
      order: { updated_at: 'DESC' },
    });
  }

  async getAllTemplate() {
    return await this.repo.find();
  }

  async deleteTemplate(id: number): Promise<boolean> {
    const template = await this.repo.findOne({ where: { id } });

    if (!template) {
      // Throw a standard Error with a custom property
      const error = new Error(`Template with ID ${id} not found`);
      (error as any).statusCode = 404; // attach status code
      throw error;
    }

    try {
      await this.repo.remove(template);
      return true;
    } catch (err: any) {
      console.error(`Error deleting template ID ${id}:`, err);
      const error = new Error("Failed to delete template. Please try again later.");
      (error as any).statusCode = 500;
      throw error;
    }
  }

}
