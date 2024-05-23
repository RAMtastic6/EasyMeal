import { IsNotEmpty, IsJWT } from "class-validator";

export class DecodeTokenDTO {

    @IsNotEmpty()
    @IsJWT()
    token: string;
}