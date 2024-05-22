import { StaffRole } from "../../staff/enities/staff.entity";

export class AdminDto {
  email: string;
  name: string;
  surname: string;
  password: string;
  restaurant: {
    name: string;
    address: string;
    city: string;
    cuisine: string;
    tables: number;
    phone_number: string;
    email: string;
    description: string;
  };
  staff: {
    role: StaffRole;
  };
  dayopen: {
    days_open: {
      day_open: number;
      opening: string;
      closing: string;
    }[];
  };
}