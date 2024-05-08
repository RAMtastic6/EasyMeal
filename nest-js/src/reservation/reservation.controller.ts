import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';

@Controller('reservation')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Post()
  async create(@Body() createReservationDto: CreateReservationDto) {
    return await this.reservationService.create(createReservationDto);
  }

  @Post('addCustomer')
  async addCustomer(@Body() params: {customer_id: number, reservation_id: number}) {
    return await this.reservationService.addCustomer(params);
  }

  @Get()
  async findAll() {
    return await this.reservationService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.reservationService.findOne(+id);
  }

  @Get(':id/orders')
  async getOrdersWithClients(@Param('id') id: number) {
    return await this.reservationService.getOrdersWithQuantityByIdReservation(id);
  }
}
