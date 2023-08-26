import { IsNotEmpty, Matches } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class RegistrationBoatDto {
  @IsNotEmpty()
  @ApiProperty({
    description: "user id required",
  })
  user: number;
  @IsNotEmpty()
  @ApiProperty({
    description: "location id required",
  })
  location: number;

  @IsNotEmpty()
  @ApiProperty({
    description: "number of maximum people required",
  })
  maxNumber: number;
  @IsNotEmpty()
  @ApiProperty({
    description: "price per hour required",
  })
  price: number;
}
