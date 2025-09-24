import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
  } from "typeorm";
  
  @Entity("tds_deductions")
  export class TdsDeduction {
    @PrimaryGeneratedColumn()
    id!: number;
  
    // References (no FK relations)
    @Column()
    tenant_id!: number;
    
    @Column({ length: 255 })
    tenant_name!: string;
  
    @Column()
    organization_id!: number;
  
    @Column({ length: 255 })
    organization_name!: string;
  
    @Column()
    property_id!: number;
  
    @Column({ length: 255 })
    property_name!: string;
  
    @Column()
    property_part_id!: number;
  
    @Column({ length: 255 })
    property_part_name!: string;
  
    // TDS-specific fields
    @Column("decimal", { precision: 10, scale: 2 })
    tds_amount!: number;
  
    @Column({ type: "date" })
    date_submitted!: Date;
  
    @Column({ length: 100 })
    challan_number!: string;
  
    @Column({ length: 100 })
    tds_reference_number!: string;
  
    @Column({ length: 255, nullable: true })
    receipt_url?: string;
  
    @CreateDateColumn()
    created_at!: Date;
  
    @UpdateDateColumn()
    updated_at!: Date;
  }
  