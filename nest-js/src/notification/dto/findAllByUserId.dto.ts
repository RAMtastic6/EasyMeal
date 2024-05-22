import { IsNotEmpty, IsNumberString } from "class-validator";

export class FindAllByUserIdDTO {
    
    @IsNumberString()
    userId: number;

    @IsNotEmpty()
    token: string;
  }