import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Orders } from './entities/order.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Orders)
    private ordersRepository: Repository<Orders>,
  ) {}
  
  create(createOrderDto: CreateOrderDto) {
    return this.ordersRepository.save(createOrderDto);
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
    if (result == null) {
      throw new NotFoundException('Order not found');
    }
    return result;
  }

  update(updateOrder: {
    customer_id: number,
    reservation_id: number,
    food_id: number,
    quantity: number
  }) {
    return this.ordersRepository.update({
      customer_id: updateOrder.customer_id,
      reservation_id: updateOrder.reservation_id,
      food_id: updateOrder.food_id
    }, {
      quantity: updateOrder.quantity
    });
  }

  remove(order: {
    customer_id: number,
    reservation_id: number,
    food_id: number,
  }) {
    return this.ordersRepository.delete([order.customer_id, order.reservation_id, order.food_id]);
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
      relations: ['food']
    });
    if (orders.length == 0) {
      throw new NotFoundException('No orders found for this reservation');
    }
    return orders;
  }

  async getRomanBill(order: {
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
  }
}
