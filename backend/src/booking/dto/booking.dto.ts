import { IsNotEmpty, Matches } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class BookingDto {
  @IsNotEmpty()
  @ApiProperty({
    description: "boat id required",
  })
  boat: number;
  @IsNotEmpty()
  @ApiProperty({
    description: "booking date required",
  })
  bookingDate: Date;
  @IsNotEmpty()
  @ApiProperty({
    description: "booking hour start is required",
  })
  bookingFrom: string;
  @IsNotEmpty()
  @ApiProperty({
    description: "booking hour end is required",
  })
  bookingTo: string;

  @IsNotEmpty()
  @ApiProperty({
    description: "please enter your names",
  })
  names: string;
  @IsNotEmpty()
  @Matches(/(07[8,2,3,9])[0-9]{7}/, {
    message:
      "Primary Phone Number must be Airtel or MTN number formatted like 07*********",
  })
  @ApiProperty({
    description: "please enter your names",
  })
  phone: string;
  @ApiProperty({
    description: "please enter  user id",
  })
  user: number;
}
