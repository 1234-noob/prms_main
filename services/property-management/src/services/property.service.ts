import { Repository, FindManyOptions } from "typeorm";
import { Property } from "../entities/property.entity";
import { PropertyPart } from "../entities/propertyPart.entity";
import { CreatePropertyDto } from "../dtos/create-property.dto";
import { UpdatePropertyDto } from "../dtos/update-property.dto";
import { AppDataSource } from "../config/AppDataSource";

export class PropertyService {
  private readonly repo: Repository<Property>;
  private readonly partRepo: Repository<PropertyPart>;

  constructor() {
    this.repo = AppDataSource.getRepository(Property);
    this.partRepo = AppDataSource.getRepository(PropertyPart);
  }

  /** Create property + if unsplittable, auto-provision a single “whole” part */
  async createProperty(data: CreatePropertyDto) {
    const prop = this.repo.create(data);
    const saved = await this.repo.save(prop);

    if (!saved.splitable) {
      await this.partRepo.save(
        this.partRepo.create({
          property: { id: saved.id } as any,
          part_name: saved.name,
          status: "Available",
        })
      );
    }

    return saved;
  }

  /** Get all, optionally filtering by isActive & org */
  async getAllProperties(filter?: {
    isActive?: boolean;
    organization_id?: number;
  }) {
    const opts: FindManyOptions<Property> = {
      relations: ["parts"],
    };
    const where: any = {};
    if (filter?.isActive !== undefined) where.isActive = filter.isActive;
    if (filter?.organization_id !== undefined)
      where.organization_id = filter.organization_id;
    if (Object.keys(where).length) opts.where = where;

    return this.repo.find(opts);
  }

  /** Get one (with its parts) */
  async getPropertyById(id: number) {
    return this.repo.findOne({
      where: { id },
      relations: ["parts"],
    });
  }

  async updateProperty(id: number, data: UpdatePropertyDto) {
    await this.repo.update(id, data);
    return this.repo.findOneBy({ id });
  }

  

  async deleteProperty(id: number) {
    return this.repo.delete(id);
  }
}
