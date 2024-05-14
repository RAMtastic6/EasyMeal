import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Reservation, ReservationStatus } from './entities/reservation.entity';
import { Repository } from 'typeorm';
import { RestaurantService } from 'src/restaurant/restaurant.service';

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(Reservation)
    private reservationRepository: Repository<Reservation>,
    private readonly restaurantService: RestaurantService,
  ) {}
  
  async create(createReservationDto: CreateReservationDto) {
    const restaurant = await this.restaurantService.findOne(createReservationDto.restaurant_id);
    if(restaurant == null) {
      throw new NotFoundException('Restaurant not found');
    }
    const booked = await this.restaurantService.getBookedTables(createReservationDto.restaurant_id, createReservationDto.date);
    if(booked >= restaurant.tables) {
      throw new HttpException('No tables available', 400);
    }
    if(Date.now() > new Date(createReservationDto.date).getTime()) {
      throw new HttpException('Invalid date', 400);
    }
    const reservation = this.reservationRepository.create({
      date: new Date(createReservationDto.date),
      number_people: createReservationDto.number_people,
      restaurant_id: createReservationDto.restaurant_id,
      customers: [{ id: createReservationDto.customer_id }],
    });
    await this.reservationRepository.save(reservation);
    return reservation;
  }

  async addCustomer(params: {customer_id: number, reservation_id: number}) {
    const reservation = await this.reservationRepository.findOne({ where: { id: params.reservation_id } });
    if(reservation == null) {
      throw new NotFoundException('Reservation not found');
    }
    await this.reservationRepository.update({ id: params.reservation_id }, {
      customers: [...reservation.customers, { id: params.customer_id }],
    });
    return true;
  }

  async findAll(): Promise<Reservation[]> {
    const reservations = await this.reservationRepository.find();
    return reservations;
  }

  async findOne(id: number) {
    const reservation = await this.reservationRepository.findOne({ where: { id } });
    return reservation;
  }

  async getMenuWithOrdersQuantityByIdReservation(id: number) {
    //otteniamo il menu e i cibi ordinati per una prenotazione
    const result = await this.reservationRepository.findOne({
      where: { 
        id: id 
      },
      relations: {
        restaurant: {
          menu: {
            foods: {
              foodIngredients: {
                ingredient: true,
              }
            }
          }
        },
        orders: {
          food: true,
        }
      },
    });
    if(result == null) {
      throw new NotFoundException('Reservation not found');
    }
    //associamo la quantita del cibo direttamente al menu
    // e rimuoviamo l'array degli ordini
    result.restaurant.menu.foods.forEach((food: any) => {
      const orders = result.orders.filter(order => order.food.id === food.id);
      food.quantity = orders.reduce((total, order) => total + order.quantity, 0);
    });
    delete result.orders;
    return result;
  }

  async getReservationsByRestaurantId(restaurantId: number) {
    const reservations = await this.reservationRepository.find({ where: { restaurant_id: restaurantId } });
    return reservations;
  }

  async acceptReservation(id: number) {
    if(await this.reservationRepository.findOne({ where: { id, state: ReservationStatus.ACCEPTED } }) || await this.reservationRepository.findOne({ where: { id, state: ReservationStatus.REJECTED } })) {
      throw new HttpException('Reservation already accepted or rejected', 400);
    }
    await this.reservationRepository.update({ id }, { state: ReservationStatus.ACCEPTED });
    return true;
  }

  async rejectReservation(id: number) {
    if(await this.reservationRepository.findOne({ where: { id, state: ReservationStatus.ACCEPTED } }) || await this.reservationRepository.findOne({ where: { id, state: ReservationStatus.REJECTED } })) {
      throw new HttpException('Reservation already accepted or rejected', 400);
    }
    await this.reservationRepository.update({ id }, { state: ReservationStatus.REJECTED });
    return true;
  }
}
