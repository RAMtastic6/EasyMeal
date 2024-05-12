import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Orders } from './entities/order.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderIngredients } from './entities/order_ingredients';
import { FoodService } from '../food/food.service';

@Injectable()
export class OrdersService {
  
  constructor(
    @InjectRepository(Orders)
    private ordersRepository: Repository<Orders>,
    @InjectRepository(OrderIngredients)
    private orderIngredientsRepository: Repository<OrderIngredients>,
    private readonly foodService: FoodService
  ) {}
  
  async create(createOrderDto: CreateOrderDto) {
    if (await this.ordersRepository.findOne({
      where: {
        customer_id: createOrderDto.customer_id,
        reservation_id: createOrderDto.reservation_id,
        food_id: createOrderDto.food_id
      }
    }) != null) {
      return null;
    }
    const order = this.ordersRepository.create(createOrderDto);
    return await this.ordersRepository.save(order);
  }

  async createOrUpdate(createOrderDto: CreateOrderDto) {
    const order = await this.ordersRepository.findOne({
      where: {
        customer_id: createOrderDto.customer_id,
        reservation_id: createOrderDto.reservation_id,
        food_id: createOrderDto.food_id
      },
      relations: {
        ingredients: {
          ingredient: true
        }
      }
    });
    if (order == null) {
      const created = await this.ordersRepository.save(createOrderDto);
      const food = await this.foodService.findOne(createOrderDto.food_id);
      for (const ingredient of food.ingredients) {
        const orderIngredient = this.orderIngredientsRepository.create({
          order_id: created.id,
          ingredient_id: ingredient.id,
          removed: false
        });
        await this.orderIngredientsRepository.save(orderIngredient);
      }
      return await this.ordersRepository.save(created);
    }
    return await this.ordersRepository.update({
      customer_id: createOrderDto.customer_id,
      reservation_id: createOrderDto.reservation_id,
      food_id: createOrderDto.food_id
    }, {
      quantity: order.quantity + createOrderDto.quantity
    })
  }

  async findAll() {
    const result = await this.ordersRepository.find();
    if (result.length == 0) {
      throw new NotFoundException('No orders found');
    }
    return result;
  }

  async findOne(order: {
    customer_id: number,
    reservation_id: number,
    food_id: number,
  }) {
    const result = await this.ordersRepository.findOne({
      where: {
        customer_id: order.customer_id,
        reservation_id: order.reservation_id,
        food_id: order.food_id
      }
    });
    return result;
  }

  async addQuantity(updateOrder: {
    customer_id: number,
    reservation_id: number,
    food_id: number,
    quantity: number
  }) {
    const result = await this.ordersRepository.findOne({
      where: {
        customer_id: updateOrder.customer_id,
        reservation_id: updateOrder.reservation_id,
        food_id: updateOrder.food_id
      }
    });
    if (result == null) {
      return null;
    }
    await this.ordersRepository.update({
      customer_id: updateOrder.customer_id,
      reservation_id: updateOrder.reservation_id,
      food_id: updateOrder.food_id
    }, {
      quantity: result.quantity + updateOrder.quantity
    });
    return result;
  }

  async updateIngredients(order: {
    id: number,
    ingredients: any[],
  }) {
    const result = await this.ordersRepository.findOne({
      where: {
        id: order.id
      },
      relations: {
        ingredients: true
      }
    });
    result.ingredients = order.ingredients;
    return await this.ordersRepository.save(result);
  }

  async remove(order: {
    customer_id: number,
    reservation_id: number,
    food_id: number,
  }) {
    return await this.ordersRepository.delete([order.customer_id, order.reservation_id, order.food_id]);
  }

  async getPartialBill(order: {
    customer_id: number,
    reservation_id: number,
  }) {
    const orders = await this.ordersRepository.find({
      where: {
        customer_id: order.customer_id,
        reservation_id: order.reservation_id,
      },
      relations: {food: true}
    });
    if (orders.length == 0) {
      throw new NotFoundException('No orders found for this reservation');
    }
    return orders.reduce((acc, order) => acc + (order.quantity * order.food.price), 0);
  }

  async getTotalBill(order: {
    reservation_id: number,
  }) {
    const orders = await this.ordersRepository.find({
      where: {
        reservation_id: order.reservation_id,
      },
      relations: { food: true}
    });
    if (orders.length == 0) {
      throw new NotFoundException('No orders found for this reservation');
    }
    return orders.reduce((acc, order) => acc + (order.quantity * order.food.price), 0);
  }

  async getReservationOrders(id: number) {
    const orders = await this.ordersRepository.find({
      where: {
        reservation_id: id
      },
      relations: {
        food: true,
        ingredients: {
          ingredient: true
        }
      },
      select: {
        food: {
          name: true,
          type: true,
        },
        ingredients: {
          ingredient: {
            name: true,
            id: true
          },
          removed: true
        }
      }
    });
    if (orders.length == 0) {
      throw new NotFoundException('No orders found for this reservation');
    }
    return orders;
  }

  async updateListOrders(order: { customer_id: number; reservation_id: number; orders: any[]; }) {
    const { customer_id, reservation_id, orders } = order;
    for (const orderItem of orders) {
      for (const ingredient of orderItem.ingredients) {
        await this.orderIngredientsRepository.save({
          order_id: orderItem.id,
          ingredient_id: ingredient.ingredient.id,
          removed: ingredient.removed
        });
      }
    };
    return true;
  }

  /*async getRomanBill(order: {
    reservation_id: number,
  }) {
    const orders = await this.ordersRepository.find({
      where: {
        reservation_id: order.reservation_id,
      },
      relations: ['food']
    });
    if (orders.length == 0) {
      throw new NotFoundException('No orders found for this reservation');
    }
    return orders.reduce((acc, order) => acc + (order.quantity * order.food.price), 0);
  }*/
}
