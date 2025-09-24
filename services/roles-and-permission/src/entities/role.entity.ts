import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinTable, ManyToMany } from 'typeorm';
import { Permission } from './permission.entity';
// import { UserRole } from '../../user-role/entities/user-role.entity';

@Entity('role')
export class Role {
  @PrimaryGeneratedColumn()
  role_id!: number;

  @Column({ length: 50 })
  role_name!: string;

  // @OneToMany(() => UserRole, userRole => userRole.role)
  // userRoles: UserRole[];

  @ManyToMany(() => Permission, { cascade: true })
  @JoinTable({
    name: 'role_permission',
    joinColumn: {
      name: 'role_id',
      referencedColumnName: 'role_id',
    },
    inverseJoinColumn: {
      name: 'permission_id',
      referencedColumnName: 'permission_id',
    },
  })
  permissions!: Permission[];
}