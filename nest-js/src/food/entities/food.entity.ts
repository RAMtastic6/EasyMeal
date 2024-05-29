import { Order } from "src/orders/entities/order.entity";
import { Column, Entity, Generated, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Ingredient } from "./ingredient.entity";
import { Menu } from "../../menu/entities/menu.entity";

export enum FoodType {
    APPETIZER = 'Aperitivo',
    FIRST_COURSE = 'Primo',
    SECOND_COURSE = 'Secondo',
    SIDE_DISH = 'Contorno',
    DESSERT = 'Dolce',
    DRINK = 'Bevanda',
    COFFEE = 'Caffè',
    PIZZA = 'Pizza',
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

    @Column({ type: "varchar", length: 255, default: "" })
    path_image: string;

    @Column({ type: "enum", enum: FoodType, default: FoodType.APPETIZER })
    type: FoodType;

    @ManyToOne(() => Menu, menu => menu.foods)
    @JoinColumn({ name: "menu_id" })
    menu: Menu;

    @OneToMany(() => Order, order => order.food)
    orders: Order[];

    @ManyToMany(() => Ingredient, ingredient => ingredient.id)
    @JoinTable({name: "food_ingredients_ingredient"})
    ingredients: Ingredient[]
}
