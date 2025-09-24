import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  OneToMany,
} from "typeorm";
import { PropertyPart } from "./propertyPart.entity";

@Entity("properties")
export class Property {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  organization_id!: number;

  @Column({ length: 255 })
  name!: string;

  @Column({ length: 255 })
  organization_name!: string;

  @Column({ length: 255, nullable: true })
  location?: string;

  @Column({ default: false })
  splitable!: boolean;

  @Column({ default: true })
  isActive!: boolean;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @OneToMany(() => PropertyPart, (part) => part.property)
  parts?: PropertyPart[];

  @Column({default:'prms_org_001'})
  applicattionID_role_pk?: string; 
}
