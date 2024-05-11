import { Controller, Post, Body } from '@nestjs/common';
import { MenuService } from './menu.service';
import { CreateMenuDto } from './dto/create-menu.dto';

@Controller('menu')
export class MenuController {
    constructor(private readonly menuRepository: MenuService) { }

    @Post()
    async create(@Body() createMenuDto: CreateMenuDto) {
        return await this.menuRepository.create(createMenuDto);
    }
   
}
