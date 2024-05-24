import { IsNotEmpty, IsNumber, IsNumberString } from "class-validator";

export class AddCustomerDTO {
    
    @IsNotEmpty()
    @IsNumberString()
    user_id: number; 

    @IsNotEmpty()
    @IsNumberString()
    reservation_id: number;
}