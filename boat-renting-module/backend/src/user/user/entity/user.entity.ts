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

import { ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { Role } from "../enums/role";
import { Boat } from "../../../boats/entity/boat.entity";
import { Payment } from "../../../payment/entity/payment.entity";
import { Booking } from "../../../booking/entity/booking.entity";
import { SupportingDoc } from "./other.doc.entity";

@Entity("users")
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ nullable: true })
  lastName: string;
  @Column()
  firstName: string;
  @Column({ nullable: true })
  dob: Date;
  @Column({ nullable: true })
  profilePicture: string;
  @Column()
  primaryPhone: string;
  @Column({ nullable: true })
  @Exclude()
  password: string;
  @Column()
  access_level: string;
  @Column()
  status: number;
  @Column({ nullable: true })
  created_by: number;
  @Column()
  updated_by: number;
  @CreateDateColumn()
  created_at: Date;
  @UpdateDateColumn()
  updated_at: Date;
  @OneToMany(() => Boat, (boat) => boat.user)
  boat: Boat[];
  @OneToMany(() => Payment, (payment) => payment.user)
  payment: Payment[];
  @OneToMany(() => Booking, (booking) => booking.user)
  booking: Booking[];
  @OneToOne(() => SupportingDoc, (supportingDoc) => supportingDoc.user) // specify inverse side as a second parameter
  supportingDoc: SupportingDoc;
}
