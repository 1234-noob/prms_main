
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, OneToMany } from 'typeorm';

@Entity('permission')
export class Permission {
  @PrimaryGeneratedColumn()
  permission_id!: number;

  @Column({ length: 50, unique: true })
  name!: string;
}