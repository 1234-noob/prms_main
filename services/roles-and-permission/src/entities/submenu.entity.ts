import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, ManyToOne, JoinColumn } from 'typeorm';
import { Permission } from './permission.entity';
import { Menu } from './menu.entity';

@Entity('submenu')
export class Submenu {
  @PrimaryGeneratedColumn()
  submenu_id!: number;

  @Column({ length: 50 })
  name!: string;

  @Column()
  path!: string

  @Column()
  componentPath!: string; 

  @ManyToMany(() => Permission)
  @JoinTable({
    name: 'submenu_permission',
    joinColumn: { name: 'submenu_id', referencedColumnName: 'submenu_id' },
    inverseJoinColumn: { name: 'permission_id', referencedColumnName: 'permission_id' },
  })
  permissions!: Permission[];

  @ManyToOne(() => Menu, menu => menu.submenus, { onDelete: 'CASCADE' }) 
  @JoinColumn({ name: 'menu_id' })  
  menu!: Menu; 
}
