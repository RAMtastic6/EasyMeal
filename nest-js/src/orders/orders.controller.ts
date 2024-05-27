import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException, BadRequestException, HttpCode, ParseIntPipe } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { AuthenticationService } from '../authentication/authentication.service';
import { FindOneDTO } from './dto/find-one.dto';
import { AddQuantityDTO } from './dto/add-quantity.dto';
import { UpdateIngredientsDTO } from './dto/update-ingredients.dto';
import { RemoveDTO } from './dto/remove.dto';
import { PartialBillDTO } from './dto/partial-bill.dto';
import { RomanBillDTO } from './dto/full-bill.dto';
import { UpdateListOrdersDTO } from './dto/update-list-orders.dto';
import { PayDTO } from './dto/pay.dto';

@Controller('orders')
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly authService: AuthenticationService
  ) { }

  // da rivedere in generale.
  @Post('create')
  async create(@Body() body: { 
    reservation_id: number,
    food_id: number,
    token: string 
  }) {
    const user = await this.authService.verifyToken(body.token);
    if (user == null) {
      throw new BadRequestException('Invalid token');
    }
    const result = await this.ordersService.create({
      reservation_id: body.reservation_id,
      food_id: body.food_id,
      user_id: user.id
    });
    if (result == null) {
      throw new NotFoundException('Order already exists');
    }
    return result;
  }

  /*@Post('createOrUpdate')
  async createOrUpdate(@Body() createOrderDto: CreateOrderDto) {
    return await this.ordersService.createOrUpdate(createOrderDto);
  }*/

  @Get()
  async findAll() {
    const result = await this.ordersService.findAll();
    if (result.length == 0) {
      throw new NotFoundException('No orders found');
    }
    return result;
  }

  @Post('findOne')
  async findOne(@Body() order: FindOneDTO) {
    const result = await this.ordersService.findOne(order);
    if (result == null) {
      throw new NotFoundException('Order not found');
    }
    return result;
  }

  @Post('addQuantity')
  async update(@Body() updateOrder: AddQuantityDTO) {
    const user = await this.authService.verifyToken(updateOrder.token);
    if (user == null) {
      throw new BadRequestException('Invalid token');
    }
    const result = await this.ordersService.addQuantity({
      user_id: user.id,
      reservation_id: updateOrder.reservation_id,
      food_id: updateOrder.food_id,
      quantity: updateOrder.quantity
    });
    if (result == null) {
      throw new NotFoundException('Order not found');
    }
    return result;
  }

  @Post('updateIngredients')
  async updateIngredients(@Body() order: UpdateIngredientsDTO) {
    const result = await this.ordersService.updateIngredients(order);
    if (result == null) {
      throw new NotFoundException('Order not found');
    }
    return result;
  }

  @Post('remove')
  async remove(@Body() order: RemoveDTO) {
    const user = await this.authService.verifyToken(order.token);
    if (user == null) {
      throw new BadRequestException('Invalid token');
    }
    return await this.ordersService.remove({
      user_id: user.id,
      reservation_id: order.reservation_id,
      food_id: order.food_id
    });
  }

  @Post('partialBill')
  async partialBill(@Body() order: PartialBillDTO) {
    return await this.ordersService.getPartialBill(order);
  }

  @Post('romanBill')
  async fullBill(@Body() order: RomanBillDTO) {
    return await this.ordersService.getRomanBill(order);
  }

  @Post('pay')
  async pay(@Body() order: PayDTO) {
    return await this.ordersService.pay(order.user_id, order.reservation_id);
  }

  @Post('updateListOrders')
  @HttpCode(200)
  async updateListOrders(@Body() order: UpdateListOrdersDTO) {
    const user = await this.authService.verifyToken(order.token);
    if(user == null)
      throw new BadRequestException('Invalid token');
    const result = await this.ordersService.updateListOrders({
      user_id: user.id,
      reservation_id: order.reservation_id,
      orders: order.orders
    });
    if(result == null) 
      throw new BadRequestException('Error updating orders');
    return result;
  }

  @Post('totalBill')
  async totalBill(@Body() order: { reservation_id: number }) {
    return await this.ordersService.getTotalBill(order);
  }

  @Get('reservation/:id')
  async getReservationOrders(@Param('id', ParseIntPipe) id: number) {
    const result = await this.ordersService.getReservationOrders(+id);
    if (result.length == 0) {
      throw new NotFoundException('No orders found');
    }
    return result;
  }
}
