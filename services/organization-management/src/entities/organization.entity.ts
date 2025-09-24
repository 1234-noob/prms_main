import { Entity, Column, CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn, BeforeInsert, PrimaryColumn } from "typeorm";

@Entity("organizations")
export class Organization {
  @PrimaryGeneratedColumn()
  id!: number;

  // @PrimaryColumn()
  // applicationIDRolePk!: string;

  // @Column()
  // someField!: string;

  // @BeforeInsert()
  // generateCustomId() {
  //   const prefix = "prms_org_";
  //   const randomId = Math.floor(100 + Math.random() * 900); // 3-digit random number
  //   this.applicationIDRolePk = `${prefix}${randomId}`;
  // }


  @Column({ length: 255 })
  name!: string;

  @Column("text", { nullable: true })
  address?: string;

  @Column({ length: 255, nullable: true })
  email?: string;

  @Column({ length: 20, nullable: true })
  contactNo?: string;

  @Column({ default: true })
  isActive!: boolean;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;


  @Column({nullable:true})
  applicattionID_role_pk?: string;
}
