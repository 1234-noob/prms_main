// src/entities/tenantPropertyPart.entity.ts
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
  } from "typeorm";
  import { Tenant } from "./tenant.entity";
  
  @Entity("tenant_property_parts")
  export class TenantPropertyPart {
    @PrimaryGeneratedColumn()
    id!: number;
  
    @Column()
    tenant_id!: number;
  
    //–– snapshot of Organization
  @Column()
  organization_id!: number;

  @Column({ length: 255 })
  organization_name!: string;

  //–– snapshot of Property
  @Column()
  property_id!: number;

  @Column({ length: 255 })
  property_name!: string;

  //–– snapshot of PropertyPart
  @Column()
  property_part_id!: number;

  @Column({ length: 255 })
  property_part_name!: string;
  
    // Relation back to Tenant
    @ManyToOne(() => Tenant, (tenant) => tenant.tenantPropertyParts, {
      onDelete: "CASCADE",
    })
    @JoinColumn({ name: "tenant_id" })
    tenant!: Tenant;

    @Column({ default: true })
  isActive!: boolean;
  
    @CreateDateColumn()
    created_at!: Date;
  
    @UpdateDateColumn()
    updated_at!: Date;
  }
  