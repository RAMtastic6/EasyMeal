import { Menu } from "src/restaurant/entities/menu.entity";
import { Orders } from "src/orders/entities/order.entity";
import { Column, Entity, Generated, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { FoodIngredient } from "./food_ingredient.entity";

export enum FoodType {
    APPETIZER = 'apertivo',
    FIRST_COURSE = 'primo',
    SECOND_COURSE = 'secondo',
    SIDE_DISH = 'contorno',
    DESSERT = 'dolce',
    DRINK = 'bevanda',
    COFFEE = 'caffè',
    PIZZA = 'pizza',
}

@Entity()
export class Food {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar", length: 100 })
    name: string;

    @Column({ type: "float" })
    price: number;

    @Column()
    menu_id: number;

    @Column({type: "varchar", length: 255, default: ""})
    path_image: string;

    @Column({ type: "enum", enum: FoodType, default: FoodType.APPETIZER})
    type: FoodType;

    @ManyToOne(() => Menu, menu => menu.foods)
    @JoinColumn({ name: "menu_id" })
    menu: Menu;

    @OneToMany(() => Orders, order => order.food)
    orders: Orders[];

    @OneToMany(() => FoodIngredient, foodIngredient => foodIngredient.food)
    foodIngredients: FoodIngredient[];
}
