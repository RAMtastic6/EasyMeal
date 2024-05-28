import { IsNotEmpty } from 'class-validator';

export class RomanBillDTO {
  @IsNotEmpty()
  customer_id: number;

  @IsNotEmpty()
  reservation_id: number;
}
