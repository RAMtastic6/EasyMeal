import { IsNotEmpty } from 'class-validator';

export class FullBillDTO {
  @IsNotEmpty()
  customer_id: number;

  @IsNotEmpty()
  reservation_id: number;
}
