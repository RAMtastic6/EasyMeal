import { Injectable, NotFoundException } from '@nestjs/common';
import { OrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderIngredients } from './entities/order_ingredients';
import { FoodService } from '../food/food.service';
import { ReservationService } from '../reservation/reservation.service';
import { ReservationStatus } from '../reservation/entities/reservation.entity';
import { NotificationService } from 'src/notification/notification.service';
import { StaffService } from 'src/staff/staff.service';

@Injectable()
export class OrdersService {

  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(OrderIngredients)
    private orderIngredientsRepository: Repository<OrderIngredients>,
    private readonly foodService: FoodService,
    private readonly reservationService: ReservationService,
    private readonly notificationService: NotificationService,
    private readonly staffService: StaffService,
  ) { }

  async create(data: {
    reservation_id: number,
    food_id: number,
    user_id: number
  }) {
    const order = this.ordersRepository.create({
      reservation_id: data.reservation_id,
      food_id: data.food_id,
      user_id: data.user_id,
      quantity: 1
    });
    await this.ordersRepository.save(order);
    const food = await this.foodService.findOne(data.food_id);
    for (const ingredient of food.ingredients) {
      const orderIngredient = this.orderIngredientsRepository.create({
        order_id: order.id,
        ingredient_id: ingredient.id,
        removed: false
      });
      await this.orderIngredientsRepository.save(orderIngredient);
    }
    return order;
  }

  async remove(order: {
    reservation_id: number,
    food_id: number,
    user_id: number
  }) {
    const result = await this.ordersRepository.findOne({
      where: {
        reservation_id: order.reservation_id,
        food_id: order.food_id,
        user_id: order.user_id
      }
    });
    if (result == null) {
      return null;
    }
    await this.ordersRepository.remove(result);
    return result;
  }

  async findAll() {
    return await this.ordersRepository.find();
  }

  async findOne(order: {
    user_id: number,
    reservation_id: number,
    food_id: number,
  }) {
    return await this.ordersRepository.findOne({
      where: {
        user_id: order.user_id,
        reservation_id: order.reservation_id,
        food_id: order.food_id
      }
    });
  }

  async addQuantity(updateOrder: {
    reservation_id: number,
    food_id: number,
    quantity: number,
    user_id: number
  }) {
    const result = await this.ordersRepository.findOne({
      where: {
        user_id: updateOrder.user_id,
        reservation_id: updateOrder.reservation_id,
        food_id: updateOrder.food_id
      }
    });
    if (result == null) {
      return null;
    }
    await this.ordersRepository.update({
      user_id: updateOrder.user_id,
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
    if (result == null) {
      return null;
    }
    result.ingredients = order.ingredients;
    return await this.ordersRepository.save(result);
  }

  async getPartialBill(order: {
    customer_id: number,
    reservation_id: number,
  }) {
    const orders = await this.ordersRepository.find({
      where: {
        user_id: order.customer_id,
        reservation_id: order.reservation_id,
      },
      relations: { food: true }
    });
    return orders.reduce((acc, order) => acc + (order.quantity * order.food.price), 0);
  }

  // Conto alla romana
  async getRomanBill(order: { reservation_id: number }) {
    const orders = await this.ordersRepository.find({
      where: {
        reservation_id: order.reservation_id,
      },
      relations: { food: true },
    });

    if (orders.length === 0) {
      return 0;
    }

    const totalCost = orders.reduce((acc, order) => acc + (order.quantity * order.food.price), 0);
    const uniqueUserIds = new Set(orders.map(order => order.user_id));
    const perPersonCost = (totalCost / uniqueUserIds.size).toFixed(2);

    return perPersonCost;
  }

  async pay(user_id: number, reservation_id: number) {
    const orders = await this.ordersRepository.find({
      where: {
        user_id,
        reservation_id
      },
      relations: { reservation: true }
    });
    if (orders.length === 0) {
      return null;
    }
    for (const order of orders) {
      order.paid = true;
    }
    await this.ordersRepository.save(orders);
    const allOrders = await this.ordersRepository.find({
      where: {
        reservation_id
      }
    });
    const allPaid = allOrders.every(order => order.paid);
    const admin = await this.staffService.getAdminByRestaurantId(orders[0].reservation.restaurant_id);
    if (allPaid) {
      await this.reservationService.updateStatus(reservation_id, ReservationStatus.COMPLETED);
      this.notificationService.create({id_receiver: admin.id, message: 'Quota pagata per tutti i partecipanti nella prenotazione con id: ' + reservation_id, title: 'Quota pagata'});
    }
    else{
      this.notificationService.create({id_receiver: admin.id, message: 'Quota pagata per ' + user_id + ' nella prenotazione con id: ' + reservation_id, title: 'Quota pagata'});
    }
    return true;
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
        },
        customer: true,
        reservation: true,
      },
      select: {
        food: {
          name: true,
          type: true,
          price: true
        },
        ingredients: {
          ingredient: {
            name: true,
            id: true
          },
          removed: true
        },
        customer: {
          id: true,
          name: true,
          surname: true
        },
      }
    });
    return orders;
  }
  

  async updateListOrders(order: { user_id: number; reservation_id: number; orders: any[]; }) {
    const { reservation_id, orders } = order;
    const reservation = await this.reservationService.findOne(reservation_id);
    if (reservation == null || reservation.state != ReservationStatus.ACCEPTED) {
      return null;
    }
    for (const orderItem of orders) {
      for (const ingredient of orderItem.ingredients) {
        await this.orderIngredientsRepository.save({
          order_id: orderItem.id,
          ingredient_id: ingredient.ingredient.id,
          removed: ingredient.removed
        });
      }
    };

    // prendere admin tramite l'id del ristorante
    const admin = await this.staffService.getAdminByRestaurantId(reservation.restaurant_id); 

    // creare una notifica rivolta all'admin del ristorante.
    await this.notificationService.create({
        message: `L'ordine associato alla prenotazione con id: ${reservation_id} è in: ${ReservationStatus.TO_PAY}`,
        title: 'Ordinazione confermata',
        id_receiver: admin.id,
      });

    return true;
  }

  async getTotalBill(order: { reservation_id: number }) {
    const orders = await this.ordersRepository.find({
      where: {
        reservation_id: order.reservation_id
      },
      relations: { food: true }
    });
    return orders.reduce((acc, order) => acc + (order.quantity * order.food.price), 0);
  }

  async checkOrdersPayStatusByUserId(user_id: number, reservation_id: number) {
    const orders = await this.ordersRepository.find({
      where: {
        user_id,
        reservation_id
      }
    });
    return orders.every(order => order.paid);
  }
}
