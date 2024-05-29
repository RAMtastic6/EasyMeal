import { IsJWT } from "class-validator";

export class ReservationAdminDTO {

  @IsJWT()
  token: string;
}