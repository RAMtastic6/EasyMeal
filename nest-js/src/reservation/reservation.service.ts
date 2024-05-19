import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Reservation, ReservationStatus } from './entities/reservation.entity';
import { Repository } from 'typeorm';
import { RestaurantService } from 'src/restaurant/restaurant.service';
import { NotificationService } from '../notification/notification.service';
import { StaffService } from '../staff/staff.service';

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
    private readonly restaurantService: RestaurantService,
    private readonly notificationService: NotificationService,
    private readonly staffService: StaffService,
  ) {}
  
  async create(dto: CreateReservationDto) {
    const restaurant = await this.restaurantService.findOne(dto.restaurant_id);
    if(restaurant == null) {
      throw new NotFoundException('Restaurant not found');
    }
    const booked = await this.restaurantService.getBookedTables(dto.restaurant_id, dto.date);
    if(booked >= restaurant.tables) {
      throw new HttpException('No tables available', 400);
    }
    if(Date.now() > new Date(dto.date).getTime()) {
      throw new HttpException('Invalid date', 400);
    }
    const reservation = this.reservationRepository.create({
      date: new Date(dto.date),
      number_people: dto.number_people,
      restaurant_id: dto.restaurant_id,
      users: [{ id: dto.user_id }],
    });
    await this.reservationRepository.save(reservation);

    // Notifiy the amministrator of the restaurant
    const admin = await this.staffService.getAdminByRestaurantId(dto.restaurant_id);
    await this.notificationService.create({
      message: `Nuova prenotazione per ${dto.number_people} persone`,
      title: 'Nuova prenotazione con id: ' + reservation.id,
      id_receiver: admin.id,
    });
    return reservation;
  }

  async addCustomer(params: { customer_id: number, reservation_id: number }) {
    const reservation = await this.reservationRepository.findOne({ where: { id: params.reservation_id } });
    if (reservation == null) {
      throw new NotFoundException('Reservation not found');
    }
    await this.reservationRepository.update({ id: params.reservation_id }, {
      users: [...reservation.users, { id: params.customer_id }],
    });

    // Notifiy the user of the restaurant
    await this.notificationService.create({
      message: `Partecipa alla prenotazione con id: ${params.reservation_id}`,
      title: 'Sei stato invitato ad una prenotazione',
      id_receiver: params.customer_id,
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
              ingredients: true,
            }
          }
        },
        orders: {
          food: true,
        }
      },
    });
    if (result == null) {
      throw new NotFoundException('Reservation not found');
    }
    //associamo la quantita del cibo direttamente al menu
    // e rimuoviamo l'array degli ordinati
    result.restaurant.menu.foods.forEach((food: any) => {
      const orders = result.orders.filter(order => order.food.id === food.id);
      food.quantity = orders.length;
    });
    delete result.orders;
    return result;
  }

  async getReservationsByRestaurantId(restaurantId: number) {
    const reservations = await this.reservationRepository.find({ where: { restaurant_id: restaurantId } });
    return reservations;
  }

  async acceptReservation(id: number) {
    if (!this.reservationRepository.findOne({ where: { id, state: ReservationStatus.PENDING } })) {
      throw new HttpException('Reservation not found', 404);
    }
    return await this.reservationRepository.update({ id }, { state: ReservationStatus.ACCEPTED });
  }

  async rejectReservation(id: number) {
    if (!this.reservationRepository.findOne({ where: { id, state: ReservationStatus.PENDING }})) {
      throw new HttpException('Reservation not found', 404);
    }
    await this.reservationRepository.update({ id }, { state: ReservationStatus.REJECTED });
    return true;
  }

  async updateStatus(id: number, state: ReservationStatus) {
    const reservation = await this.reservationRepository.findOne({ where: { id } });
    if (reservation == null) {
      return false;
    }
    await this.reservationRepository.update({ id }, { state });
    //Notify all the users of the reservation changed status
    for(const user of reservation.users) {
      await this.notificationService.create({
        message: `La tua prenotazione con id: ${id} è stata ${state}`,
        title: 'Aggiornamento prenotazione',
        id_receiver: user.id,
      });
    }
    return true;
  }
}
