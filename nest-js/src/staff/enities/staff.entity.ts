import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Restaurant } from "../../restaurant/entities/restaurant.entity";
import { User } from "../../user/entities/user.entity";

export enum StaffRole {
  ADMIN = 'admin',
  STAFF = 'staff'
}

@Entity()
export class Staff {
  @PrimaryGeneratedColumn()
  id: number; 

  @Column({type: 'enum', enum: StaffRole, default: StaffRole.STAFF, name: 'ruolo'})
  role: StaffRole;

  @Column()
  restaurant_id: number;

  @Column()
  user_id: number;

  @ManyToOne(() => Restaurant, restaurant => restaurant.id)
  @JoinColumn({name: 'restaurant_id'})
  restaurant: Restaurant;

  @ManyToOne(() => User , user => user.id)
  @JoinColumn({name: 'user_id'})
  user: User;
}