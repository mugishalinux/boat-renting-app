import { IsNotEmpty, Matches } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class PaymentDto {
  @IsNotEmpty()
  @ApiProperty({
    description: "booking id required",
  })
  booking: number;
  @IsNotEmpty()
  @ApiProperty({
    description: "user id required",
  })
  user: number;
  @IsNotEmpty()
  @ApiProperty({
    description: "amount required",
  })
  amount: number;

  @IsNotEmpty()
  @ApiProperty({
    description: "credit card number required",
  })
  card: string;

  @IsNotEmpty()
  @ApiProperty({
    description: "cvv of credit card required",
  })
  cvv: string;

  @IsNotEmpty()
  @ApiProperty({
    description: "expiration of credit card required",
  })
  expire: string;
}
