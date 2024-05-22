import { IsNotEmpty, IsNumberString, IsJWT } from "class-validator";

export class FindAllByUserIdDTO {
    
    @IsNumberString()
    userId: number;

    @IsNotEmpty()
    @IsJWT()
    token: string;
  }