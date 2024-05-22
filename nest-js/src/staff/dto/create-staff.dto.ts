import { StaffRole } from "../enities/staff.entity";
import { IsNotEmpty } from "class-validator";

export class StaffDto {
  @IsNotEmpty()
  restaurant_id: number;

  @IsNotEmpty()
  role: StaffRole;

  @IsNotEmpty()
  user_id: number;
}