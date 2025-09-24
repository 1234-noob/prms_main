// src/services/tenant.service.ts
import { Repository } from "typeorm";
import { Tenant } from "../entities/tenant.entity";
import { TenantPropertyPart } from "../entities/tenantPropertyPart.entity";
import { Contract } from "../entities/contract.entity";
import { ContractTenant } from "../entities/contractTenant.entity";
import { TenantFilterDto } from "../dtos/tenant-filter.dto";
import {
  TenantWithMappingsDto,
  TenantPropertyPartDto,
  ContractSummaryDto,
} from "../dtos/tenant-response.dto";
import { AppDataSource } from "../config/AppDataSource";
import { CreateTenantDto } from "../dtos/create-tenant.dto";
import { UpdateTenantDto } from "../dtos/update-tenant.dto";
import { CreateTenantPropertyPartDto } from "../dtos/create-tenantPropertyPart.dto";
import { UpdateTenantPropertyPartDto } from "../dtos/update-tenantPropertyPart.dto";

export class TenantService {
  private readonly tenantRepo = AppDataSource.getRepository(Tenant);
  private readonly tppRepo    = AppDataSource.getRepository(TenantPropertyPart);
  private readonly contractRepo = AppDataSource.getRepository(Contract);
  private readonly ctRepo      = AppDataSource.getRepository(ContractTenant);

  async fetchTenants(filter: TenantFilterDto): Promise<TenantWithMappingsDto[]> {
    const qb = this.tenantRepo
      .createQueryBuilder("t")
      // join only active mappings by default
      .leftJoinAndSelect("t.tenantPropertyParts", "m", filter.contract_id == null
        ? "m.isActive = :mapActive"
        : "m.isActive = :mapActive AND m.id IN (" +
            this.ctRepo
              .createQueryBuilder("ct")
              .select("ct.id")
              .where("ct.contract_id = :contractId")
              .getQuery() +
          ")",
        { mapActive: filter.isActive ?? true, contractId: filter.contract_id })
      .where("1=1");

    // enforce only one of org/property/part
    if (filter.organization_id) {
      qb.andWhere("m.organization_id = :org", { org: filter.organization_id });
    } else if (filter.property_id) {
      qb.andWhere("m.property_id = :prop", { prop: filter.property_id });
    } else if (filter.property_part_id) {
      qb.andWhere("m.property_part_id = :ppart", {
        ppart: filter.property_part_id,
      });
    }

    if (filter.createdAfter) {
      qb.andWhere("m.created_at >= :createdAfter", {
        createdAfter: filter.createdAfter,
      });
    }

    const tenants = await qb.getMany();

    // format each tenant
    return Promise.all(
      tenants.map(async (t) => {
        const mappings = t.tenantPropertyParts.map(
          (m): TenantPropertyPartDto => ({
            id: m.id,
            organization_id: m.organization_id,
            organization_name: m.organization_name,
            property_id: m.property_id,
            property_name: m.property_name,
            property_part_id: m.property_part_id,
            property_part_name: m.property_part_name,
            isActive: m.isActive,
            created_at: m.created_at,
            updated_at: m.updated_at,
          })
        );

        let contracts: ContractSummaryDto[] = [];
        if (filter.includeContracts) {
          // gather all mapping IDs for this tenant
          const partIds = mappings.map((m) => m.property_part_id);
          if (partIds.length > 0) {
          const raw = await this.contractRepo
            .createQueryBuilder("c")
            .where("c.property_part_id IN (:...parts)", { parts: partIds })
            .andWhere(
              filter.isActive != null ? "c.isActive = :cActive" : "1=1",
              { cActive: filter.isActive }
            )
            .getMany();

          contracts = raw.map(
            (c): ContractSummaryDto => ({
              contract_id: c.id,
              property_id: c.property_id,
              property_name: c.property_name,
              property_part_id: c.property_part_id,
              property_part_name: c.property_part_name,
              organization_id: c.organization_id,
              organization_name: c.organization_name,
              rent_amount: c.rent_amount,
              start_date: c.start_date,
              end_date: c.end_date,
              isActive: c.isActive,
            })
          );
        }
      }

        return {
          id: t.id,
          name: t.name,
          contact: t.contact,
          email: t.email,
          isActive: t.isActive,
          created_at: t.created_at,
          updated_at: t.updated_at,
          mappings,
          ...(filter.includeContracts ? { contracts } : {}),
        };
      })
    );
  }

  async fetchTenantById(
    id: number,
    includeContracts = false
  ): Promise<TenantWithMappingsDto | null> {
    // Just re‐use fetchTenants with default filter,
    // then pick the one whose id matches
    const all = await this.fetchTenants({ includeContracts });
    return all.find((t) => t.id === id) ?? null;
  }

  // ...create, update, delete remain unchanged...

  
  /** 1. Create tenant default inactive */
  async createTenant(data: CreateTenantDto) {
    const tenant = this.tenantRepo.create({ ...data, isActive: false });
    return await this.tenantRepo.save(tenant);
  }

 /** 2. Change status only */
 async changeTenantStatus(id: number, isActive: boolean) {
  await this.tenantRepo.update(id, { isActive });
  return this.tenantRepo.findOneBy({ id });
}

  // 5. Update tenant (other fields + optional isActive)
  async updateTenant(id: number, data: UpdateTenantDto) {
    await this.tenantRepo.update(id, data);
    return this.tenantRepo.findOneBy({ id });
  }

  /** 9. Delete tenant only if no mappings & no contracts */
  async deleteTenantConditional(id: number) {
    const mappingCount = await this.tppRepo.count({ where: { tenant_id: id } });
    const contractCount = await this.ctRepo.count({ where: { tenant_id: id } });
    if (mappingCount || contractCount) {
      throw new Error(
        `Cannot delete tenant: ${mappingCount} mapping(s), ${contractCount} contract(s) exist`
      );
    }
    return this.tenantRepo.delete(id);
  }

    // ── Tenant–PropertyPart Mapping ──────────────────────────

  /** 3. Assign tenant ↔ org-prop-part (defaults to active) */
  async createTenantPropertyPart(
    data: CreateTenantPropertyPartDto
  ): Promise<TenantPropertyPart> {
    const mapping = this.tppRepo.create(data);
    return this.tppRepo.save(mapping);
  }

  /** 6 & 7. Update a mapping’s snapshots or toggle isActive */
  async updateTenantPropertyPart(
    id: number,
    data: UpdateTenantPropertyPartDto
  ): Promise<TenantPropertyPart | null> {
    await this.tppRepo.update(id, data);
    return this.tppRepo.findOneBy({ id });
  }

  /** 8. Delete a tenant-property-part mapping */
  async deleteTenantPropertyPart(id: number): Promise<void> {
    await this.tppRepo.delete(id);
  }

  
}



