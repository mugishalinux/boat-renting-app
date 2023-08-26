import { IsEmail, IsIn, IsNotEmpty, Matches } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
// import { Roles } from "../../models/roles";

export class BookingDto {
  @IsNotEmpty()
  @ApiProperty({ description: "boat it required" })
  boat: number;

  @IsNotEmpty()
  @ApiProperty({ description: "date from required" })
  bookingDate: Date;

  @IsNotEmpty()
  @ApiProperty({ description: "booking from hour required" })
  bookingFrom: string;

  @IsNotEmpty()
  @ApiProperty({ description: "booking to hour required" })
  bookingTo: string;

  @IsNotEmpty()
  @ApiProperty({ description: "please enter names" })
  names: string;

  @IsNotEmpty()
  @Matches(/(07[8,2,3,9])[0-9]{7}/, {
    message:
      "Primary Phone Number must be Airtel or MTN number formatted like 07*********",
  })
  @ApiProperty({
    description: "primary phone required",
  })
  phone: string;

  @IsNotEmpty()
  @ApiProperty({
    description: "user id required",
  })
  user: number;
  @IsNotEmpty()
  @ApiProperty({
    description: "different hours id required",
  })
  diffHours: number;
}
