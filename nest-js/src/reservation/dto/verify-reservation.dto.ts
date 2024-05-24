import { IsJWT, IsNotEmpty, IsNumberString, IsString } from "class-validator";

export class verifyReservationDto {
  
  @IsJWT()
  token: string;

  @IsNumberString()
  id_prenotazione: number;
}