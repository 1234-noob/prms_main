// src/entities/tenant.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { TenantPropertyPart } from "./tenantPropertyPart.entity";
import { ContractTenant } from "./contractTenant.entity";

@Entity("tenants")
export class Tenant {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 255 })
  name!: string;

  @Column({ length: 15 })
  contact!: string;

  @Column({ length: 255 })
  email!: string;

  @Column({ default: true })
  isActive!: boolean;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  //–– m:n → PropertyPart
  @OneToMany(() => TenantPropertyPart, (tpp) => tpp.tenant)
  tenantPropertyParts!: TenantPropertyPart[];

  //–– m:n → Contract
  @OneToMany(() => ContractTenant, (ct) => ct.tenant)
  contractTenants!: ContractTenant[];
}
