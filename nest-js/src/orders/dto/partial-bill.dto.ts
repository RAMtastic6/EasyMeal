import { IsNotEmpty } from "class-validator";

export class PartialBillDTO {
    @IsNotEmpty()
    customer_id: number;

    @IsNotEmpty()
    reservation_id: number;
}
