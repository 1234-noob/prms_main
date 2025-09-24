// src/services/contract.service.ts
import { Repository } from "typeorm";
import { Contract } from "../entities/contract.entity";
import { ContractTenant } from "../entities/contractTenant.entity";
import { ContractFilterDto } from "../dtos/contract-filter.dto";
import { ContractWithTenantsDto } from "../dtos/contract-response.dto";
import { AppDataSource } from "../config/AppDataSource";
import { CreateContractDto } from "../dtos/create-contract.dto";
import { UpdateContractDto } from "../dtos/update-contract.dto";
import { TenantPropertyPart } from "../entities/tenantPropertyPart.entity";

export class ContractService {
  private readonly repo  = AppDataSource.getRepository(Contract);
  private readonly ctRepo = AppDataSource.getRepository(ContractTenant);
  private readonly tppRepo    = AppDataSource.getRepository(TenantPropertyPart);
  

  async fetchContracts(
    filter: ContractFilterDto
  ): Promise<ContractWithTenantsDto[]> {
    const qb = this.repo
      .createQueryBuilder("c")
      .leftJoinAndSelect("c.contractTenants", "ct")
      .where("1=1");

    if (filter.isActive != null) {
      qb.andWhere("c.isActive = :cActive", { cActive: filter.isActive });
    }
    if (filter.tds_applicable != null) {
      qb.andWhere("c.tds_applicable = :tds", {
        tds: filter.tds_applicable,
      });
    }

    // only one of org/prop/part
    if (filter.organization_id) {
      qb.andWhere("c.organization_id = :org", {
        org: filter.organization_id,
      });
    } else if (filter.property_id) {
      qb.andWhere("c.property_id = :prop", { prop: filter.property_id });
    } else if (filter.property_part_id) {
      qb.andWhere("c.property_part_id = :ppart", {
        ppart: filter.property_part_id,
      });
    }

    if (filter.tenant_id) {
      qb.andWhere("ct.tenant_id = :tid", { tid: filter.tenant_id });
    }

    // contract period range
    if (filter.startDate || filter.endDate) {
    const today = new Date().toISOString().slice(0, 10);
    const plusOneYear = new Date();
  plusOneYear.setFullYear(plusOneYear.getFullYear() + 1);
  const nextYear = plusOneYear.toISOString().slice(0, 10);


    const start = filter.startDate ?? "2001-01-01";
    const end   = filter.endDate   ?? nextYear;
    qb.andWhere("c.start_date BETWEEN :start AND :end", { start, end });
    }
    if (filter.createdAfter) {
      qb.andWhere("c.created_at >= :cAfter", {
        cAfter: filter.createdAfter,
      });
    }
    if (filter.updatedAfter) {
      qb.andWhere("c.updated_at >= :uAfter", {
        uAfter: filter.updatedAfter,
      });
    }

    const raw = await qb.getMany();

    return raw.map((c): ContractWithTenantsDto => ({
      id: c.id,
      organization_id: c.organization_id,
      organization_name: c.organization_name,
      property_id: c.property_id,
      property_name: c.property_name,
      property_part_id: c.property_part_id,
      property_part_name: c.property_part_name,
      rent_amount: c.rent_amount,
      start_date: c.start_date,
      end_date: c.end_date,
      tds_applicable: c.tds_applicable,
      isActive: c.isActive,
      created_at: c.created_at,
      updated_at: c.updated_at,
      tenant_ids: c.contractTenants.map((ct) => ct.tenant_id),
    }));
  }

  async fetchContractById(
    id: number
  ): Promise<ContractWithTenantsDto | null> {
    // Simply list *all* (no special filters) and find by id
    const all = await this.fetchContracts({});
    return all.find((c) => c.id === id) ?? null;
  }

  /** 4. Create contract + auto‐map tenants if none provided */
  async createContract(data: CreateContractDto) {
    const contract = this.repo.create({ ...data, isActive: true });
    const saved = await this.repo.save(contract);

    // determine tenant IDs:
    let tenantIds = data.tenant_ids;
    if (!tenantIds || tenantIds.length === 0) {
      // fetch all active mappings for this part
      const mappings = await this.tppRepo.find({
        where: { property_part_id: data.property_part_id, isActive: true },
      });
      tenantIds = mappings.map((m) => m.tenant_id);
    }

    // insert into contract_tenants
    for (const tid of tenantIds) {
      await this.ctRepo.save({ contract_id: saved.id, tenant_id: tid });
    }

    return this.fetchContractById(saved.id)!;
  }

  /** 10. Update contract & optionally reassign tenants */
  async updateContract(id: number, data: UpdateContractDto) {
    await this.repo.update(id, data);

    if (data.tenant_ids) {
      // clear old mappings
      await this.ctRepo.delete({ contract_id: id });
      // reassign
      for (const tid of data.tenant_ids) {
        await this.ctRepo.save({ contract_id: id, tenant_id: tid });
      }
    }

    return this.fetchContractById(id);
  }

  /** 11. Change status only */
  async changeContractStatus(id: number, isActive: boolean) {
    await this.repo.update(id, { isActive });
    return this.fetchContractById(id);
  }

  /** 12. Delete contract + its mappings */
  async deleteContract(id: number) {
    await this.ctRepo.delete({ contract_id: id });
    return this.repo.delete(id);
  }

}

 

