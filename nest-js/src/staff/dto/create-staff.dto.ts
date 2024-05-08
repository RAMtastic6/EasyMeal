import { StaffRole } from "../enities/staff.entity";

export class StaffDto {
  restaurant_id: number;
  role: StaffRole;
  user_id: number;
}