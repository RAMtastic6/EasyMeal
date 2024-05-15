import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException, BadRequestException, HttpCode } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('create')
  async create(@Body() createOrderDto: CreateOrderDto) {
    const result = await this.ordersService.create(createOrderDto);
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

  @Post('addQuantity')
  async update(@Body() updateOrder: {
    customer_id: number,
    reservation_id: number,
    food_id: number,
    quantity: number
  }) {
    return await this.ordersService.addQuantity(updateOrder);
  }

  @Post('updateIngredients')
  async updateIngredients(@Body() order: {
    id: number,
    ingredients: any[],
  }) {
    return await this.ordersService.updateIngredients(order);
  }

  @Post('remove')
  async remove(@Body() order: {
    reservation_id: number,
    food_id: number,
    customer_id: number,
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

  @Post('updateListOrders')
  @HttpCode(200)
  async updateListOrders(@Body() order: {
    customer_id: number,
    reservation_id: number,
    orders: any[],
  }) {
    const result = await this.ordersService.updateListOrders(order);
    if(result === null) 
      throw new BadRequestException('Error updating orders');
    return result;
  }

  @Get('reservation/:id')
  async getReservationOrders(@Param('id') id: string) {
    return await this.ordersService.getReservationOrders(+id);
  }
}
