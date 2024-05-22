import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateRestaurantDto as RestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { Restaurant } from './entities/restaurant.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StaffRole } from '../staff/enities/staff.entity';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectRepository(Restaurant)
    private restaurantRepo: Repository<Restaurant>,
  ) { }

  async getFilteredRestaurants(query: {
    date?: string,
    name?: string,
    city?: string,
    cuisine?: string
  }, currentPage: number, ITEMS_PER_PAGE: number): Promise<Restaurant[]> {
    let queryBuilder = this.restaurantRepo.createQueryBuilder('restaurant');
    if (query.date) {
      const dayOfWeek = ["domenica", "lunedì", "martedì", "mercoledì", "giovedì", "venerdì", "sabato"][new Date(query.date).getDay()];
      queryBuilder = queryBuilder.innerJoin('restaurant.daysOpen', 'daysOpen', 'daysOpen.dayOpen = :dayOfWeek', { dayOfWeek });
    }
    if (query.name) {
      queryBuilder = queryBuilder.andWhere('restaurant.name = :name', { name: query.name });
    }
    if (query.city) {
      queryBuilder = queryBuilder.andWhere('restaurant.city = :city', { city: query.city });
    }
    if (query.cuisine) {
      queryBuilder = queryBuilder.andWhere('restaurant.cuisine = :cuisine', { cuisine: query.cuisine.toLowerCase() });
    }

    const offset = (currentPage - 1) * ITEMS_PER_PAGE;
    const result = await queryBuilder
      .skip(offset)
      .take(ITEMS_PER_PAGE);
    return result.getMany();
  }

  async create(createRestaurantDto: RestaurantDto) {
    const { name, address, city, cuisine, tables, email, phone_number } = createRestaurantDto;
    // Check if the restaurant already exists
    const existingRestaurant = await this.restaurantRepo.findOne({ 
      where: { name: createRestaurantDto.name } 
    });
    if (existingRestaurant) {
      return null;
    }
    
    if (!name || !address || !city || !cuisine || !tables || !email || !phone_number) {
      return null;
    }
    
    const restaurant = this.restaurantRepo.create({
      name: name,
      address: address,
      city: city,
      cuisine: cuisine,
      tables: tables,
      email: email,
      phone_number: phone_number
    });
    return await this.restaurantRepo.save(restaurant);
  }

  async findAll(): Promise<Restaurant[]> {
    const restaurants = this.restaurantRepo.find();
    return restaurants;
  }

  async findAllCuisines(): Promise<string[]> {
    const rest = await this.restaurantRepo.createQueryBuilder('restaurant')
      .select('DISTINCT cuisine')
      .getRawMany();
    return rest.map(rest => rest.cuisine);
  }

  async findAllCities(): Promise<string[]> {
    const rest = await this.restaurantRepo.createQueryBuilder('restaurant')
      .select('DISTINCT city')
      .getRawMany();
    return rest.map(rest => rest.city);
  }

  async findOne(id: number) {
    const restaurant = await this.restaurantRepo.findOne({ 
      where: { id },
    });
    return restaurant;
  }

  //Ritorna i tavoli prenotati in un ristorante in una data specifica
  async getBookedTables(restaurantId: number, date: string) {
    const [, result] = await this.restaurantRepo.findAndCount({
      relations: ['reservations'],
      where: {
        id: restaurantId,
        reservations: {
          date: new Date(date),
        }
      },
    });
    return result;
  }

  async getNumberOfFilteredRestaurants(query: {
    date?: string,
    name?: string,
    city?: string,
    cuisine?: string
  }) {
    let queryBuilder = this.restaurantRepo.createQueryBuilder('restaurant');
    if (query.date) {
      const dayOfWeek = ["domenica", "lunedì", "martedì", "mercoledì", "giovedì", "venerdì", "sabato"][new Date(query.date).getDay()];
      queryBuilder = queryBuilder.innerJoin('restaurant.daysOpen', 'daysOpen', 'daysOpen.dayOpen = :dayOfWeek', { dayOfWeek });
    }
    if (query.name) {
      queryBuilder = queryBuilder.andWhere('restaurant.name = :name', { name: query.name });
    }
    if (query.city) {
      queryBuilder = queryBuilder.andWhere('restaurant.city = :city', { city: query.city });
    }
    if (query.cuisine) {
      queryBuilder = queryBuilder.andWhere('restaurant.cuisine = :cuisine', { cuisine: query.cuisine.toLowerCase() });
    }
    return await queryBuilder.getCount();
  }

  async getRestaurantAndMenuByRestaurantId(id: number) {
    const result = await this.restaurantRepo.findOne({
      where: { id },
      relations: {
        menu: {
          foods: {
            ingredients: true
          } 
        }
      }
    });
    return result;
  }
}
