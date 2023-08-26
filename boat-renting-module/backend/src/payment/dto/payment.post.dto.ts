import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class PaymentPostDto {
  @IsNotEmpty()
  @ApiProperty({
    description: "amount  required",
  })
  amount: number;
  @IsNotEmpty()
  @ApiProperty({
    description: "currency required ",
  })
  currency: string;
}
