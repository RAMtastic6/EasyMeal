import { IsJWT, IsNotEmpty, IsString } from "class-validator";

export class verifyReservationDto {
  
  @IsJWT()
  token: string;
}