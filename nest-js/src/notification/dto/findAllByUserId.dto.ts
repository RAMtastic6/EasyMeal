import { IsNotEmpty, IsNumberString, IsJWT } from "class-validator";

export class FindAllByUserIdDTO {
    
  @IsNotEmpty()
  @IsJWT()
  token: string;
}