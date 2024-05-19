import { Controller, Get, Post, Body, Patch, Param, Delete, Query, NotFoundException, BadRequestException } from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { CreateRestaurantDto as RestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';

@Controller('restaurant')
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) { }

  @Get('filter')
  getFilteredRestaurants(
    @Query() query: {
      date?: string,
      name?: string,
      city?: string,
      cuisine?: string
    },
    @Query('currentPage') currentPage: number,
    @Query('ITEMS_PER_PAGE') ITEMS_PER_PAGE: number
  ) {
    return this.restaurantService.getFilteredRestaurants(query, currentPage, ITEMS_PER_PAGE);
  }

  @Post()
  create(@Body() createRestaurantDto: RestaurantDto) {
    const result = this.restaurantService.create(createRestaurantDto);
    if (result == null) {
      throw new BadRequestException('Invalid restaurant');
    }
    return result;
  }

  @Get()
  findAll() {
    return this.restaurantService.findAll();
  }

  @Get('cuisines')
  findAllCuisines() {
    return this.restaurantService.findAllCuisines();
  }

  @Get('cities')
  findAllCities() {
    return this.restaurantService.findAllCities();
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
  findOne(@Param('id') id: string) {
    return this.restaurantService.findOne(+id);
  }

  @Get(':id/booked-tables')
  getBookedTables(@Param('id') id: string, @Query('date') date: string) {
    return this.restaurantService.getBookedTables(+id, date);
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
