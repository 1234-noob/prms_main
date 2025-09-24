import { FindOptionsWhere, Repository } from "typeorm";
import { Organization } from "../entities/organization.entity";
import { CreateOrganizationDto } from "../dtos/create-organization.dto";
import { UpdateOrganizationDto } from "../dtos/update-organization.dto";
import { AppDataSource } from "../config/AppDataSource";

export class OrganizationService {
  private readonly organizationRepo: Repository<Organization>;

  constructor() {
    this.organizationRepo = AppDataSource.getRepository(Organization);
  }

  async createOrganization(data: CreateOrganizationDto) {
    console.log("Creating organization with data:", data);
    const newOrg = this.organizationRepo.create(data);
    return await this.organizationRepo.save(newOrg);
  }

  async getAllOrganizations(filter?: { isActive?: boolean }) {
    const where: FindOptionsWhere<Organization> = {};
    if (filter && filter.isActive !== undefined) {
      where.isActive = filter.isActive;
    }
    return await this.organizationRepo.find({ where });
  }

  async getOrganizationById(id: number) {
    return await this.organizationRepo.findOneBy({ id });
  }

  async updateOrganization(id: number, data: UpdateOrganizationDto) {
    await this.organizationRepo.update(id, data);
    return await this.organizationRepo.findOneBy({ id });
  }

  async deleteOrganization(id: number) {
    return await this.organizationRepo.delete(id);
  }
}
