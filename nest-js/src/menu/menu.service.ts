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
   
  }
}
