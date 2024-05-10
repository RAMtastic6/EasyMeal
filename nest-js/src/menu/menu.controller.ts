import { Controller } from '@nestjs/common';
import { Menu } from './entities/menu.entity';
import { Repository } from 'typeorm';
import { CreateMenuDto } from './dto/create-menu.dto';
import { Body, Post } from '@nestjs/common';

@Controller('menu')
export class MenuController {
    constructor(private readonly menuRepository: Repository<Menu>) {}

    @Post()
    async create(@Body() createMenuDto: CreateMenuDto) {
        return await this.menuRepository.save(createMenuDto);
    }
   
}
