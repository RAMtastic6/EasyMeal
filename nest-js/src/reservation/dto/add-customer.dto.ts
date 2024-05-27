import { IsJWT, IsNotEmpty, IsNumber, IsNumberString } from "class-validator";

export class AddCustomerDTO {
    
    @IsJWT()
    token: string; 

    @IsNotEmpty()
    @IsNumberString()
    reservation_id: number;
}