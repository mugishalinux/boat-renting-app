import { IsEmail, IsIn, IsNotEmpty, Matches } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class AccountDto {
  @IsNotEmpty()
  @ApiProperty({ description: "card required" })
  card: string;
  @IsNotEmpty()
  @ApiProperty({ description: "cvv required" })
  cvv: string;
  @IsNotEmpty()
  @ApiProperty({ description: "expiration date required" })
  expire: string;
}
