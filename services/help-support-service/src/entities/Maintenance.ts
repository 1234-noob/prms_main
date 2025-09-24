import { create } from "domain";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Maintenance {
    // Define properties and decorators similar to the Dispute entity
    // Example:
    @PrimaryGeneratedColumn()
    id?: number;

    @Column()
    issueType?: string;

    @Column()
    unit?: number;

    @Column()
    propertyId?: number;

    @Column()
    TenantId?: number;

    @Column({ default: null })
    description?: string;

    @CreateDateColumn()
    createdAt?: Date;

    @UpdateDateColumn()
    updatedAt?: Date;



}