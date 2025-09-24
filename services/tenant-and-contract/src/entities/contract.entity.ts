// src/entities/contract.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { ContractTenant } from "./contractTenant.entity";

@Entity("contracts")
export class Contract {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  property_id!: number;

  @Column()
  property_part_id!: number;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  rent_amount!: number;

  @Column({ type: "date" })
  start_date!: Date;

  @Column({ type: "date" })
  end_date!: Date;

  @Column({ default: false })
  tds_applicable!: boolean;

  @Column({ default: true })
  isActive!: boolean;

  // optional snapshots
  @Column({ length: 255 })
  property_name!: string;

  @Column({ length: 255 })
  property_part_name!: string;

  @Column()
  organization_id!: number;

  @Column({ length: 255 })
  organization_name!: string;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  //–– m:n → Tenant
  @OneToMany(() => ContractTenant, (ct) => ct.contract)
  contractTenants!: ContractTenant[];
}
