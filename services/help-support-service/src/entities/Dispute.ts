import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
  BeforeInsert,
} from 'typeorm';
import { AppDataSource } from '../database/data-source';

@Entity()
export class Dispute {
  @PrimaryGeneratedColumn()
  id?: number;

  // @PrimaryColumn({ type: 'varchar', length: 50 })
  // id?: string;

  @Column()
  tenantId?: number;

  @Column()
  invoiceId?: number;

  @Column()
  reason?: string;

  @Column({ default: null })
  filePath?: string;

  @Column({ default: 'pending' })
  status?: string;

  @Column({ nullable: true })
  submissionDate?: Date;

  @Column({ nullable: true })
  exeternal_id?: string;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;


  // @BeforeInsert()
  // async generateId() {
  //   try {
  //     const disputeRepository = AppDataSource.getRepository(Dispute);
  //     // Fetch the latest dispute ordered by createdAt
  //     const lastDispute = await disputeRepository.find({
  //       order: { createdAt: 'DESC' },
  //       take: 1, // Limit to 1 result
  //     });

  //     let sequenceNumber = 1;
  //     if (lastDispute.length > 0 && lastDispute[0].id) {
  //       const lastIdNumber = parseInt(lastDispute[0].id.split('-')[1] || '0', 10);
  //       sequenceNumber = lastIdNumber + 1;
  //     }

  //     this.id = `DISP-${sequenceNumber.toString().padStart(6, '0')}`;
  //   } catch (error) {
  //     console.error('Error generating dispute ID:', error);
  //     // Fallback ID using timestamp to ensure uniqueness
  //     this.id = `DISP-${Date.now().toString().slice(-6)}`;
  //   }
  // }


}
