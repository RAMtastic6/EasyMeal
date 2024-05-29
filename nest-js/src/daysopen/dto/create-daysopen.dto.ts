import { Day } from '../entities/daysopen.entity';
import { IsArray, IsNotEmpty, ValidateNested } from 'class-validator';
import { DayOpenDTO } from './dayOpen.dto';
import { Type } from 'class-transformer';

export class CreateDaysopenDto {
  @IsNotEmpty()
  restaurant_id: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DayOpenDTO)
  days_open: DayOpenDTO[];
}
