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
import { Booking } from "../../booking/entity/booking.entity";
import { User } from "../../user/user/entity/user.entity";

@Entity("payment")
export class Payment extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @OneToOne(() => Booking)
  @JoinColumn()
  booking: Booking;
  @Column()
  amount: number;
  @Column()
  paymentStatus: string;
  @Column()
  iniPaymentRef: number;
  @Column()
  extPaymentRef: number;
  @Column()
  status: number;
  @Column()
  accountNumber: string;
  @Column({ nullable: true })
  created_by: number;
  @Column()
  updated_by: number;
  @CreateDateColumn()
  created_at: Date;
  @UpdateDateColumn()
  updated_at: Date;
  @ManyToOne(() => User, (user) => user.boat)
  user: User;
}
