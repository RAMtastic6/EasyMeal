import { Controller, Get, Post, Body, Patch, Param, Delete, Query, NotFoundException, BadRequestException } from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { CreateRestaurantDto as RestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';

@Controller('restaurant')
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) { }

  @Get('filter')
  async getFilteredRestaurants(
    @Query() query: {
      date?: string,
      name?: string,
      city?: string,
      cuisine?: string
    },
    @Query('currentPage') currentPage: number,
    @Query('ITEMS_PER_PAGE') ITEMS_PER_PAGE: number
  ) {
    return await this.restaurantService.getFilteredRestaurants(query, currentPage, ITEMS_PER_PAGE);
  }

  @Post()
  async create(@Body() createRestaurantDto: RestaurantDto) {
    const result = await this.restaurantService.create(createRestaurantDto);
    if (result == null) {
      throw new BadRequestException('Invalid restaurant');
    }
    return result;
  }

  @Get()
  async findAll() {
    return await this.restaurantService.findAll();
  }

  @Get('cuisines')
  async findAllCuisines() {
    return await this.restaurantService.findAllCuisines();
  }

  @Get('cities')
  async findAllCities() {
    return await this.restaurantService.findAllCities();
  }

  @Get('count')
  async getNumberOfFilteredRestaurants(@Query() query: {
    date?: string,
    name?: string,
    city?: string,
    cuisine?: string
  }) {
    return await this.restaurantService.getNumberOfFilteredRestaurants(query);
  }
  
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.restaurantService.findOne(+id);
  }

  @Get(':id/booked-tables')
  async getBookedTables(@Param('id') id: string, @Query('date') date: string) {
    return await this.restaurantService.getBookedTables(+id, date);
  }

  @Get(':id/menu')
  async getRestaurantAndMenuByRestaurantId(@Param('id') id: string) {
    const result = await this.restaurantService.getRestaurantAndMenuByRestaurantId(+id);
    if (result == null) {
      throw new NotFoundException('Reservation not found');
    }
    return result;
  }
}
