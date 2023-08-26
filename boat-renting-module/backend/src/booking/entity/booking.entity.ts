import { Boat } from "../../boats/entity/boat.entity";
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
import { Payment } from "../../payment/entity/payment.entity";
import { User } from "../../user/user/entity/user.entity";

@Entity("booking")
export class Booking extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  bookingRef: number;
  @Column()
  bookingDate: Date;
  @Column()
  bookingFrom: string;
  @Column()
  bookingTo: string;
  @Column()
  status: number;
  @Column()
  names: string;
  @Column()
  phoneNumber: string;
  @Column({ nullable: true })
  created_by: number;
  @Column()
  updated_by: number;
  @CreateDateColumn()
  created_at: Date;
  @UpdateDateColumn()
  updated_at: Date;
  @ManyToOne(() => Boat, (boat) => boat.location)
  boat: Boat;
  @ManyToOne(() => User, (user) => user.booking)
  user: User;
  @OneToOne(() => Payment, (payment) => payment.booking) // specify inverse side as a second parameter
  payment: Payment;
}
