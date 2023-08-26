import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsOptional, Matches } from "class-validator";
import { BaseEntity, BeforeInsert } from "typeorm";

export class UserDto extends BaseEntity {
  @IsNotEmpty()
  @ApiProperty({
    description: "names required",
  })
  names: string;
  @IsNotEmpty()
  @Matches(/(07[8,2,3,9])[0-9]{7}/, {
    message:
      "Phone Number must be Airtel or MTN number formatted like 2507*********",
  })
  @ApiProperty({
    description: "phone number required",
  })
  phone: string;
  @IsNotEmpty()
  @ApiProperty({
    description: "user role required",
  })
  access_level: string;
  @IsNotEmpty()
  @ApiProperty({
    description: "password required",
  })
  password: string;
}
