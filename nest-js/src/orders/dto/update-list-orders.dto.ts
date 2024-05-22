import { IsNotEmpty, IsJWT } from 'class-validator';

export class UpdateListOrdersDTO {
  @IsNotEmpty()
  @IsJWT()
  token: string;

  @IsNotEmpty()
  reservation_id: number;

  @IsNotEmpty()
  orders: any[];
}
