import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }

  @Get()
  findAll() {
    return this.ordersService.findAll();
  }

  @Post('findOne')
  findOne(@Body() order: {
    customer_id: number,
    reservation_id: number,
    food_id: number,
  }) {
    return this.ordersService.findOne(order);
  }

  @Post('update')
  update(@Body() updateOrder: {
    customer_id: number,
    reservation_id: number,
    food_id: number,
    quantity: number
  }) {
    return this.ordersService.update(updateOrder);
  }

  @Post('remove')
  remove(@Body() order: {
    customer_id: number,
    reservation_id: number,
    food_id: number,
  }) {
    return this.ordersService.remove(order);
  }

  @Post('partialBill')
  partialBill(@Body() order: {
    customer_id: number,
    reservation_id: number,
  }) {
    return this.ordersService.getPartialBill(order);
  }

  @Post('romanBill')
  romanBill(@Body() order: {
    reservation_id: number,
  }) {
    return this.ordersService.getRomanBill(order);
  }

  @Post('totalBill')
  fullBill(@Body() order: {
    customer_id: number,
    reservation_id: number,
  }) {
    return this.ordersService.getTotalBill(order);
  }

  @Get('reservation/:id')
  getReservationOrders(@Param('id') id: string) {
    return this.ordersService.getReservationOrders(+id);
  }
}
