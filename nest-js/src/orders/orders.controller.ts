import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async create(@Body() createOrderDto: CreateOrderDto) {
    return await this.ordersService.create(createOrderDto);
  }

  @Get()
  async findAll() {
    return await this.ordersService.findAll();
  }

  @Post('findOne')
  async findOne(@Body() order: {
    customer_id: number,
    reservation_id: number,
    food_id: number,
  }) {
    return await this.ordersService.findOne(order);
  }

  @Post('update')
  async update(@Body() updateOrder: {
    customer_id: number,
    reservation_id: number,
    food_id: number,
    quantity: number
  }) {
    return await this.ordersService.update(updateOrder);
  }

  @Post('remove')
  async remove(@Body() order: {
    customer_id: number,
    reservation_id: number,
    food_id: number,
  }) {
    return await this.ordersService.remove(order);
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

  @Get('reservation/:id')
  async getReservationOrders(@Param('id') id: string) {
    return await this.ordersService.getReservationOrders(+id);
  }
}
