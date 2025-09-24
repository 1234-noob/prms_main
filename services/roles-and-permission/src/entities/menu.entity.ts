// src/menu/entities/menu.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Submenu } from './submenu.entity';

@Entity('menu')
export class Menu {
  @PrimaryGeneratedColumn()
  menu_id!: number;

  @Column({ length: 50 })
  name!: string;

  @Column()
  path!: string

  @OneToMany(() => Submenu, submenu => submenu.menu)
  submenus!: Submenu[];
}
