import { Menu } from "src/menu/entities/menu.entity";
import { Orders } from "src/orders/entities/order.entity";
import { Column, Entity, Generated, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Food {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: "varchar", length: 100})
    name: string;

    @Column({type: "float"})
    price: number;

    @Column()
    menu_id: number;

    @ManyToOne(() => Menu, menu => menu.foods)
    @JoinColumn({name: "menu_id"})
    menu: Menu;

    @OneToMany(() => Orders, order => order.food)
    orders: Orders[];
}
