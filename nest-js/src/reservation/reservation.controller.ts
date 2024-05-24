import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException, BadRequestException, UnauthorizedException, ParseIntPipe, Res } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { AuthenticationService } from '../authentication/authentication.service';
import { AddCustomerDTO } from './dto/add-customer.dto';
import { ReservationStatus } from './entities/reservation.entity';

@Controller('reservation')
export class ReservationController {
  constructor(
    private readonly reservationService: ReservationService,
    private readonly authService: AuthenticationService,
  ) {}

  @Post()
  async create(@Body() createReservationDto: CreateReservationDto) {
    const user = await this.authService.verifyToken(createReservationDto.token);
    if(user == null) {
      throw new UnauthorizedException('Invalid token');
    }
    const result = await this.reservationService.create(
      createReservationDto.restaurant_id,
      createReservationDto.date,
      createReservationDto.number_people,
      user.id,
    );
    if(result == null) {
      throw new BadRequestException('Invalid reservation');
    }
    return result;
  }

  @Post('addCustomer')
  // {customer_id: number, reservation_id: number}
  async addCustomer(@Body() body: AddCustomerDTO) {
    const result = await this.reservationService.addCustomer(body);
    if(result == null) {
      throw new NotFoundException('Reservation not found');
    }
    return result;
  }

  @Get()
  async findAll() {
    const result = await this.reservationService.findAll();
    if(result.length == 0) {
      throw new NotFoundException('No reservations found');
    }
    return result;
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const result = await this.reservationService.findOne(+id);
    if(result == null) {
      throw new NotFoundException('Reservation not found');
    }
    return result;
  }

  @Get(':id/orders')
  async getMenuWithOrdersQuantityByIdReservation(@Param('id', ParseIntPipe) id: number) {
    const result = await this.reservationService.getMenuWithOrdersQuantityByIdReservation(id);
    if(result == null) {
      throw new NotFoundException('Reservation not found');
    }
    return result;
  }

  @Get('restaurant/:restaurantId')
  async getReservationsByRestaurantId(@Param('restaurantId', ParseIntPipe) restaurantId: number) {
    return await this.reservationService.getReservationsByRestaurantId(restaurantId);
  }

  @Get('user/:userId')
  async getReservationsByUserId(@Param('userId') userId: number) {
    return await this.reservationService.getReservationsByUserId(userId);
  }


  @Post(':id/accept')
  async acceptReservation(@Param('id', ParseIntPipe) id: number) {
    const result = await this.reservationService.updateStatus(
      id,
      ReservationStatus.ACCEPTED,
    );
    if (result == null)
      throw new NotFoundException('Reservation not found');
    return result;
  }

  @Post(':id/reject')
  async rejectReservation(@Param('id', ParseIntPipe) id: number) {
    const result = await this.reservationService.updateStatus(
      id,
      ReservationStatus.REJECTED,
    );
    if (result == null)
      throw new NotFoundException('Reservation not found');
    return result;
  }
}
