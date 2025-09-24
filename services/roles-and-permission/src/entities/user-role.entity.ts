import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Role } from "./role.entity";

@Entity("user_role")
export class UserRole {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Role)
  @JoinColumn({ name: "role_id" })
  role!: Role;

  @Column({ nullable: true })
  tenant_id?: number;

  @Column({ nullable: true })
  organization_id?: number;

}
