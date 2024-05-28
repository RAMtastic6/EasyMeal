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
import { UserService } from '../user/user.service';
import { StaffRole } from '../staff/enities/staff.entity';

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
    private readonly restaurantService: RestaurantService,
    private readonly notificationService: NotificationService,
    private readonly staffService: StaffService,
    private readonly userService: UserService
  ) { }

  async create(
    restaurant_id: number,
    date: string,
    number_people: number,
    user_id: number,
  ) {
    const restaurant = await this.restaurantService.findOne(restaurant_id);
    if (restaurant == null) {
      return null;
    }
    const booked = await this.restaurantService.getBookedTables(restaurant_id, date);
    if (booked >= restaurant.tables) {
      return { status: false, message: 'Restaurant is full' };
    }
    if (Date.now() > new Date(date).getTime()) {
      return null;
    }

    const user = await this.userService.findOne(user_id);

    const reservation = this.reservationRepository.create({
      date: new Date(date),
      number_people: number_people,
      restaurant_id: restaurant_id,
      users: [user],
    });
    const result = await this.reservationRepository.save(reservation);

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

  async addCustomer(params: {
    user_id: number,
    reservation_id: number
  }) {
    const reservation = await this.reservationRepository.findOne({
      where: { id: params.reservation_id },
      relations: { users: true },
    });
    if (reservation == null) {
      return null
    }
    if (reservation.number_people <= reservation.users.length) {
      return false;
    }
    const user = await this.userService.findOne(params.user_id);
    reservation.users = [...reservation.users, user];
    await this.reservationRepository.save(reservation);
    return true;
  }

  async findAll(): Promise<Reservation[]> {
    const reservations = await this.reservationRepository.find();
    return reservations;
  }

  async findOne(id: number) {
    const reservation = await this.reservationRepository.findOne({ where: { id }, relations: { users: true }, select: { users: { id: true } } });
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
    const reservations = await this.reservationRepository.find({
      where: { users: { id: userId } },
      relations:
      {
        users: true,
        restaurant: true
      },
      select:
      {
        restaurant:
        {
          name: true
        }
      }
    });
    return reservations;
  }

  /*async acceptReservation(id: number) {
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
  }*/

  async completeReservation(id: number) {
    if (await this.reservationRepository.findOne({ where: { id, state: ReservationStatus.TO_PAY } }) == null) {
      return null;
    }
    await this.reservationRepository.update({ id }, { state: ReservationStatus.COMPLETED });
    return true;
  }

  async updateStatus(id: number, state: ReservationStatus) {
    const reservation = await this.reservationRepository.findOne({
      where: { id },
      relations: { users: true },
    });
    if (reservation == null) {
      return false;
    }
    await this.reservationRepository.update({ id }, { state });
    //Notify all the users of the reservation changed status

    if (state == ReservationStatus.ACCEPTED || state == ReservationStatus.REJECTED) {
      for (const user of reservation.users) {
        /*if(user.id === user_id) {
          continue;
        }*/
        await this.notificationService.create({
          message: `La tua prenotazione con id: ${id} è in: ${state}`,
          title: 'Aggiornamento prenotazione',
          id_receiver: user.id,
        });
      }
    }
    return true;
  }

  async verifyReservation(reservation_id: number, user_id: number) {
    const reservation = await this.reservationRepository.findOne({
      where: { id: reservation_id, users: { id: user_id } },
      relations: { users: true },
    });
    if (reservation == null) {
      return null;
    }
    return reservation;
  }

  async getReservationsByAdminId(adminId: number) {
    return await this.reservationRepository.find({
      where: { restaurant: { staff: { id: adminId, role: StaffRole.ADMIN } } },
      relations: {
        restaurant: { staff: true }
      },
    });
  }

  async getUserOfReservation(id: number, userId: number) {
    const reservation = await this.reservationRepository.findOne({
      where: { id, users: { id: userId } },
    });
    if(reservation == null) {
      return false;
    }
    return true;
  }

  async setPaymentMethod(reservation_id: number, isRomanBill: boolean) {
    const reservation = await this.reservationRepository.findOne({
      where: { id: reservation_id },
    });
    if (reservation == null || reservation.state !== ReservationStatus.ACCEPTED) {
      return null;
    }
    await this.reservationRepository.update({ id: reservation_id }, { isRomanBill });
    await this.updateStatus(reservation_id, ReservationStatus.TO_PAY);
    return true;
  }
}
