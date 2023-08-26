import {
    BaseEntity,
    BeforeInsert,
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
  } from "typeorm";
  import { User } from "./user.entity";
  
  @Entity("transaction")
  export class Transaction extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    amount: number;
    @Column()
    externalRef: number;
    @Column()
    transactionType: string;
    @ManyToOne(() => User, (user) => user.transaction)
    user: User;
    @CreateDateColumn()
    created_at: Date;

  }
  