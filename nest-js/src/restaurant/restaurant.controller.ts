import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { CreateRestaurantDto as RestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';

@Controller('restaurant')
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Get('filter')
  getFilteredRestaurants(@Query() query: { 
    date?: string,
    name?: string,
    city?: string, 
    cuisine?: string }) 
    {
    return this.restaurantService.getFilteredRestaurants(query);
  }

  @Post()
  create(@Body() createRestaurantDto: RestaurantDto) {
    return this.restaurantService.create(createRestaurantDto);
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

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.restaurantService.findOne(+id);
  }

  @Get(':id/menu')
  findMenuByRestaurantId(@Param('id') id: string) {
    return this.restaurantService.findMenuByRestaurantId(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRestaurantDto: UpdateRestaurantDto) {
    return this.restaurantService.update(+id, updateRestaurantDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.restaurantService.remove(+id);
  }

  @Get(':id/booked-tables')
  getBookedTables(@Param('id') id: string, @Query('date') date: string) {
    return this.restaurantService.getBookedTables(+id, date);
  }

  @Get(':id/menu')
  getMenuByReservationId(@Param('id') id: string) {
    return this.restaurantService.getMenuByRestaurantId(+id);
  }
}
