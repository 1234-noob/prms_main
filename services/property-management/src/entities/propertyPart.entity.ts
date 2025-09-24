import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Property } from "./property.entity";

@Entity("property_parts")
export class PropertyPart {
  @PrimaryGeneratedColumn()
  id!: number;

  // BOTH the relation AND the raw FK column:
  @ManyToOne(() => Property, (p) => p.parts, { onDelete: "CASCADE" })
  @JoinColumn({ name: "property_id" })
  property!: Property;

  @Column()
  property_id!: number;

  @Column({ length: 255 })
  part_name!: string;

  @Column({
    type: "enum",
    enum: ["Available", "Rented"],
    default: "Available",
  })
  status!: "Available" | "Rented";

  @Column({ default: true })
  isActive!: boolean;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

}
