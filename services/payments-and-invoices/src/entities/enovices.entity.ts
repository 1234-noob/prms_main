// src/entities/invoice.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";


@Entity("invoices")
export class Invoice {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  contract_id!: number;

  @Column()
  property_part_id!: number;

  @Column({ nullable: true })
  organization_id!: number;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  amount!: number;

  @Column({ type: "date" })
  due_date!: Date;

  @Column({ default: "pending" }) // status column
  status!: string;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @Column()
  external_id?: string;

  @Column()
  tenant_id!:number

  @Column()
  frequency?: string;

  @Column()
  merchant?: string;

  @Column()
  tenant_name?: string;

  @Column({ default: false })
  bulkUploaded?: boolean;

  @Column({ nullable: true })
  file_alias_name?: string;


  @Column({ nullable: true })
  receipt_path?: string;


}
