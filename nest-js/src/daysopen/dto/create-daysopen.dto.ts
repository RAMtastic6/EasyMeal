import { Day } from '../entities/daysopen.entity';
import { IsNotEmpty } from 'class-validator';

export class CreateDaysopenDto {
  @IsNotEmpty()
  restaurant_id: number;

  days_open: {
    day_open: Day;
    opening: string;
    closing: string;
  }[];
}
