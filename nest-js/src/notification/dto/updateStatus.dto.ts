import { IsNotEmpty, IsJWT } from "class-validator";

export class UpdateStatusDTO {

    @IsNotEmpty()
    notificationId: number; 

    @IsNotEmpty()
    @IsJWT()
    token: string;
}