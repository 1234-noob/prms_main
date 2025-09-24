import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Contact {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  tenantId?: number;

  @Column()
  unit?: number;

  @Column()
  propertyId?: number;

  @Column()
  reason?: string;

  @Column({ default: null })
  description?: string;

  @Column({ default: null })
  status?: string;

  @Column({ name: 'external_id' })
  externalId?: string;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;


}
