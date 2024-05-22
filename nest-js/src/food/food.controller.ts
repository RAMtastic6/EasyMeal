import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException, ParseIntPipe } from '@nestjs/common';
import { FoodService } from './food.service';
import { CreateFoodDto } from './dto/create-food.dto';
import { UpdateFoodDto } from './dto/update-food.dto';

@Controller('food')
export class FoodController {
  constructor(private readonly foodService: FoodService) {}

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: string) {
    const result = this.foodService.findOne(+id);
    if (result) {
      return result;
    }
    throw new NotFoundException(`Food with id ${id} not found`);
  }
}
