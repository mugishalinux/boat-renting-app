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
  maxNumber: any;
  @IsNotEmpty()
  @ApiProperty({
    description: "price per hour required",
  })
  price: any;
  @IsNotEmpty()
  @ApiProperty({
    description: "provide boat images ",
  })
  boatImages: string;
}
