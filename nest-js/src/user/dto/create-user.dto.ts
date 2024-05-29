import { IsEmail, IsNotEmpty } from 'class-validator';

export class UserDto {
    name: string;
    surname: string;

    @IsEmail()
    email: string;

    @IsNotEmpty()
    password: string;
}
