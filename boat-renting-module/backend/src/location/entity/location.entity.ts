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

@Entity("location")
export class Location extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ nullable: true, type: "text" })
  locationName: string;
  @Column()
  locationImage: string;
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
  @OneToMany(() => Boat, (boat) => boat.location)
  boat: Boat[];
}
