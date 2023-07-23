import { IsEmail, IsIn, IsNotEmpty, Matches } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
// import { Roles } from "../../models/roles";

export class RegisterDto {
  @IsNotEmpty()
  @ApiProperty({ description: "please enter first name" })
  firstName: string;

  @IsNotEmpty()
  @ApiProperty({ description: "please enter last name" })
  lastName: string; 

  @IsNotEmpty()
  @ApiProperty({ description: "please enter date of birth" })
  dob: Date;

  @IsNotEmpty()
  @Matches(/(07[8,2,3,9])[0-9]{7}/, {
    message:
      "Primary Phone Number must be Airtel or MTN number formatted like 07*********",
  })
  @ApiProperty({
    description: "primary phone required",
  })
  phoneNumber: string;

  @ApiProperty()
  @IsNotEmpty()
  access_level: string;

  @IsNotEmpty()
  @ApiProperty()
  password: string;
  @IsNotEmpty()
  @ApiProperty({ description: "provide profile picture" })
  profilePicture: string;
  @IsNotEmpty()
  @ApiProperty({
    description: "provide RDB certificate  ",
  })
  rdbCertificate: string;
  @IsNotEmpty()
  @ApiProperty({
    description: "provide national id document ",
  })
  nationalIdentification: string;
}
