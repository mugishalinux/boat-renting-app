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

@Entity("supportingdoc")
export class SupportingDoc extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ nullable: true })
  nationalId: string;
  @Column({ nullable: true })
  rdbCertificate: string;
  @OneToOne(() => User)
  @JoinColumn()
  user: User;
}
