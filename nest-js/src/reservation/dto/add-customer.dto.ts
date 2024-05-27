import { IsJWT, IsNotEmpty, IsNumber, IsNumberString } from "class-validator";

export class AddCustomerDTO {
    
    @IsJWT()
    token: string; 

    @IsNotEmpty()
    @IsNumber()
    reservation_id: number;
}