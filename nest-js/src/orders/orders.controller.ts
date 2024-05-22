import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException, BadRequestException, HttpCode, ParseIntPipe } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { AuthenticationService } from '../authentication/authentication.service';

@Controller('orders')
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly authService: AuthenticationService
  ) { }

  @Post('create')
  async create(@Body() body: { 
    reservation_id: number,
    food_id: number,
    token: string 
  }) {
    console.log(body);
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
  async findOne(@Body() order: {
    user_id: number,
    reservation_id: number,
    food_id: number,
  }) {
    const result = await this.ordersService.findOne(order);
    if (result == null) {
      throw new NotFoundException('Order not found');
    }
    return result;
  }

  @Post('addQuantity')
  async update(@Body() updateOrder: {
    token: string,
    reservation_id: number,
    food_id: number,
    quantity: number
  }) {
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
  async updateIngredients(@Body() order: {
    id: number,
    ingredients: any[],
  }) {
    const result = await this.ordersService.updateIngredients(order);
    if (result == null) {
      throw new NotFoundException('Order not found');
    }
    return result;
  }

  @Post('remove')
  async remove(@Body() order: {
    reservation_id: number,
    food_id: number,
    token: string,
  }) {
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
  async partialBill(@Body() order: {
    customer_id: number,
    reservation_id: number,
  }) {
    return await this.ordersService.getPartialBill(order);
  }

  @Post('totalBill')
  async fullBill(@Body() order: {
    customer_id: number,
    reservation_id: number,
  }) {
    return await this.ordersService.getTotalBill(order);
  }

  @Post('updateListOrders')
  @HttpCode(200)
  async updateListOrders(@Body() order: {
    token: string,
    reservation_id: number,
    orders: any[],
  }) {
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

  @Get('reservation/:id')
  async getReservationOrders(@Param('id', ParseIntPipe) id: number) {
    const result = await this.ordersService.getReservationOrders(+id);
    if (result.length == 0) {
      throw new NotFoundException('No orders found');
    }
    return result;
  }
}
