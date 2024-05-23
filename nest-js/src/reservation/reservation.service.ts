import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Reservation, ReservationStatus } from './entities/reservation.entity';
import { Repository } from 'typeorm';
import { RestaurantService } from 'src/restaurant/restaurant.service';
import { NotificationService } from '../notification/notification.service';
import { StaffService } from '../staff/staff.service';
import { AuthenticationService } from '../authentication/authentication.service';

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
    private readonly restaurantService: RestaurantService,
    private readonly notificationService: NotificationService,
    private readonly staffService: StaffService,
  ) {}
  
  async create(
    restaurant_id: number,
    date: string,
    number_people: number,
    user_id: number,
  ) {
    const restaurant = await this.restaurantService.findOne(restaurant_id);
    if(restaurant == null) {
      return null;
    }
    const booked = await this.restaurantService.getBookedTables(restaurant_id, date);
    if(booked >= restaurant.tables) {
      return { status: false, message: 'Restaurant is full' };
    }
    if(Date.now() > new Date(date).getTime()) {
      return null;
    }
    const reservation = this.reservationRepository.create({
      date: new Date(date),
      number_people: number_people,
      restaurant_id: restaurant_id,
      users: [{ id: user_id }],
    });
    await this.reservationRepository.save(reservation);

    // Notifiy the amministrator of the restaurant
    const admin = await this.staffService.getAdminByRestaurantId(restaurant_id);
    await this.notificationService.create({
      message: `Nuova prenotazione per ${number_people} persone`,
      title: 'Nuova prenotazione con id: ' + reservation.id,
      id_receiver: admin.id,
    });

    return {
      status: true,
      id: reservation.id,
      data: reservation
    };
  }

  async addCustomer(params: { customer_id: number, reservation_id: number }) {
    const reservation = await this.reservationRepository.findOne({ where: { id: params.reservation_id } });
    if(reservation == null) {
      return null
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
    if(result == null) {
      return null;
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


  async getReservationsByUserId(userId: number) {
    const reservations = await this.reservationRepository.find({ where: { users:{id:userId}  }, relations:{users:true} });
    return reservations;
  }

  async acceptReservation(id: number) {
    if (await this.reservationRepository.findOne({ where: { id, state: ReservationStatus.PENDING } }) == null) {
      return null;
    }
    return await this.reservationRepository.update({ id }, { state: ReservationStatus.ACCEPTED });
  }

  async rejectReservation(id: number) {
    if (await this.reservationRepository.findOne({ where: { id, state: ReservationStatus.PENDING }}) == null) {
      return null;
    }
    await this.reservationRepository.update({ id }, { state: ReservationStatus.REJECTED });
    return true;
  }

  async completeReservation(id: number) {
    if (await this.reservationRepository.findOne({ where: { id, state: ReservationStatus.TO_PAY }}) == null) {
      return null;
    }
    await this.reservationRepository.update({ id }, { state: ReservationStatus.COMPLETED });
    return true;
  }

 async updateStatus(id: number, state: ReservationStatus, user_id: number) {
    const reservation = await this.reservationRepository.findOne({ 
      where: { id },
      relations: { users: true  },
    });
    if(reservation == null) {
      return false;
    }
    await this.reservationRepository.update({ id }, { state });
    //Notify all the users of the reservation changed status

    for(const user of reservation.users) {
      if(user.id === user_id) {
        continue;
      }
      await this.notificationService.create({
        message: `La tua prenotazione con id: ${id} è stata ${state}`,
        title: 'Aggiornamento prenotazione',
        id_receiver: user.id,
      });
    }
    return true;
  }
}
