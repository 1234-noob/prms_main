import { Repository, FindManyOptions } from "typeorm";
import { PropertyPart } from "../entities/propertyPart.entity";
import { Property } from "../entities/property.entity";
import { CreatePropertyPartDto } from "../dtos/create-propertyPart.dto";
import { UpdatePropertyPartDto } from "../dtos/update-propertyPart.dto";
import { AppDataSource } from "../config/AppDataSource";

export class PropertyPartService {
  private readonly repo: Repository<PropertyPart>;
  private readonly propRepo: Repository<Property>;

  constructor() {
    this.repo = AppDataSource.getRepository(PropertyPart);
    this.propRepo = AppDataSource.getRepository(Property);
  }

  /** Only splittable properties can gain parts */
  async createPropertyPart(data: CreatePropertyPartDto) {
    const prop = await this.propRepo.findOneBy({ id: data.property_id });
    if (!prop) throw new Error(`Property ${data.property_id} not found.`);
    if (!prop.splitable)
      throw new Error(`Property ${data.property_id} is not splittable.`);

    const part = this.repo.create({
      property: { id: data.property_id } as any,
      part_name: data.part_name,
      status: data.status ?? "Available",
    });
    return this.repo.save(part);
  }

  /** List parts, with optional isActive & property_id filters */
  async getAllPropertyParts(filter?: {
    isActive?: boolean;
    property_id?: number;
  }) {
    const opts: FindManyOptions<PropertyPart> = {
      relations: ["property"],
    };
    const where: any = {};
    if (filter?.isActive !== undefined) where.isActive = filter.isActive;
    if (filter?.property_id !== undefined)
      where.property = { id: filter.property_id };
    if (Object.keys(where).length) opts.where = where;

    const parts = await this.repo.find(opts);
    return parts.map((p) => ({
      id: p.id,
      part_name: p.part_name,
      status: p.status,
      isActive: p.isActive,
      created_at: p.created_at,
      updated_at: p.updated_at,
      property_id: p.property.id,
    }));
  }

  async getPropertyPartById(id: number) {
    return this.repo.findOne({
      where: { id },
      relations: ["property"],
    });
  }

  async updatePropertyPart(id: number, data: UpdatePropertyPartDto) {
    await this.repo.update(id, data);
    return this.repo.findOneBy({ id });
  }

  async deletePropertyPart(id: number) {
    return this.repo.delete(id);
  }
}
