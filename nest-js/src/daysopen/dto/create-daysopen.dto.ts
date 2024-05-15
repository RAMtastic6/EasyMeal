import { Day } from '../entities/daysopen.entity';

export class CreateDaysopenDto {
  restaurant_id: number;
  days_open: {
    day_open: Day;
    opening: string;
    closing: string;
  }[];
}
