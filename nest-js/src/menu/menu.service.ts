import { Injectable } from '@nestjs/common';
import { Menu } from './entities/menu.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateMenuDto } from './dto/create-menu.dto';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(Menu)
    private menuRepository: Repository<Menu>,
  ) {}
  
  async create(createMenuDto: CreateMenuDto) {
    const menu = this.menuRepository.create({
      name: createMenuDto.name,
      foods: createMenuDto.foods,
      restaurant: { id: createMenuDto.restaurant_id },
    });
    return this.menuRepository.save(menu);
  }
}
