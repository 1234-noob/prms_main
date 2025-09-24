import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { TemplateType } from "./templates.entity";
// Adjust path as needed

@Entity("templates")
export class Templates {
  @PrimaryGeneratedColumn()
  id!: number;

@Column({})
  organization_id!: number;

  @Column()
  template_type_id!: number;

  // 👇 Define the relationship
  @ManyToOne(() => TemplateType, { eager: true })
  @JoinColumn({ name: "template_type_id" })
  template_type!: TemplateType;

  @Column({ type: "text", nullable: true })
  html_content!: string;
  ;

  @Column({ type: "varchar", length: 50 ,nullable:true})
  layout_type!: string;

  @Column({ type: "text", nullable: true })
  logo_url?: string;

  @Column({ type: "varchar", length: 20, nullable: true })
  primary_color?: string;

  @Column({ type: "varchar", length: 50, nullable: true })
  font_family?: string;

  @Column({ default: true,nullable: true })
  show_discount!: boolean;

  @Column({ default: false ,nullable: true})
  show_qr_code!: boolean;

  @Column({ type: "json", nullable: true })
  custom_labels?: Record<string, string>;

  @Column({ type: "text", nullable: true })
  footer_note?: string;

  @Column({ type: "varchar", length: 20, nullable: true })
  date_format?: string;

  @Column({ type: "varchar", length: 10, nullable: true })
  currency_format?: string;

  @Column({ type: "text", nullable: true })
  receipt_background_url?: string;

  @Column({ default: true })
  is_active!: boolean;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
