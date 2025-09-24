import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
} from "typeorm";



@Entity("templates_type")
export class TemplateType {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({unique:true})
    type!: string;

    @Column({})
    description!: string;

    @CreateDateColumn()
    created_at!: Date;

    @UpdateDateColumn()
    updated_at!: Date;
}
