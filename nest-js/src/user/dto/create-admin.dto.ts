import { IsEmail, IsEnum, IsString, Length } from "class-validator";
import { StaffRole } from "../../staff/enities/staff.entity";

class RestaurantDto {
  @IsString()
  @Length(1, 50)
  name: string;

  @IsString()
  @Length(1, 100)
  address: string;

  @IsString()
  @Length(1, 50)
  city: string;

  @IsString()
  @Length(1, 50)
  cuisine: string;

  @IsString()
  tables: number;

  @IsString()
  @Length(1, 30)
  phone_number: string;

  @IsEmail()
  email: string;

  @IsString()
  @Length(1, 255)
  description: string;
};

class StaffDto {
  @IsEnum(StaffRole)
  role: StaffRole;
}

export class AdminDto {
  @IsEmail()
  email: string;

  @IsString()
  @Length(1, 50)
  name: string;

  @IsString()
  @Length(1, 50)
  surname: string;

  @IsString()
  @Length(8, 20)
  password: string;
  
  restaurant: RestaurantDto;

  staff: StaffDto;

  dayopen: {
    days_open: {
      day_open: number;
      opening: string;
      closing: string;
    }[];
  };
}