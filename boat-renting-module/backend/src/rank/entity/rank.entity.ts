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
import { Boat } from "../../boats/entity/boat.entity";

@Entity("rank")
export class Rank extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Boat)
  @JoinColumn()
  boat: Boat;

  @Column()
  ranks: number

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
