// src/entities/contractTenant.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Tenant } from "./tenant.entity";
import { Contract } from "./contract.entity";

@Entity("contract_tenants")
export class ContractTenant {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  contract_id!: number;

  @Column()
  tenant_id!: number;

  // Relation back to Contract
  @ManyToOne(() => Contract, (contract) => contract.contractTenants, {
    onDelete: "CASCADE",
  })
  @JoinColumn({
    name: "contract_id",
    foreignKeyConstraintName: "FK_contract_tenant_contract_id",
  })
  contract!: Contract;

  // Relation back to Tenant
  @ManyToOne(() => Tenant, (tenant) => tenant.contractTenants, {
    onDelete: "CASCADE",
  })

  
  @JoinColumn({
    name: "tenant_id",
    foreignKeyConstraintName: "FK_contract_tenant_tenant_id",
  })
  tenant!: Tenant;
  @CreateDateColumn()
  created_at!: Date;
}
