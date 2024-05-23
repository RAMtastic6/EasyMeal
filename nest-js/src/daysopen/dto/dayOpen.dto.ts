import { IsEnum, IsNotEmpty } from "class-validator";
import { Day } from "../entities/daysopen.entity";

export class DayOpenDTO {
    @IsEnum(Day)
    day_open: Day;

    @IsNotEmpty()
    opening: string;

    @IsNotEmpty()
    closing: string;
}