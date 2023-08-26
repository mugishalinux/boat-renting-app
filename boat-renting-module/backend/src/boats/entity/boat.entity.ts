import { User } from "../../user/user/entity/user.entity";
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
import { Location } from "../../location/entity/location.entity";
import { BoatImages } from "./boat.photo";
import { Rank } from "../../rank/entity/rank.entity";
import { Booking } from "../../booking/entity/booking.entity";

@Entity("boat")
export class Boat extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  price: number;
  @Column()
  maxNumber: number;
  @ManyToOne(() => User, (user) => user.boat)
  user: User;
  @OneToOne(() => Rank, (rank) => rank.boat) // specify inverse side as a second parameter
  rank: Rank;
  @ManyToOne(() => Location, (location) => location.boat)
  location: Location;
  @OneToMany(() => Booking, (booking) => booking.boat)
  booking: Booking;
  @Column()
  boatImages: string;
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
}
