import { IsEmail, IsIn, IsNotEmpty, Matches } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
// import { Roles } from "../../models/roles";

export class ForgetPasswordDto {
  @IsNotEmpty()
  @Matches(/(07[8,2,3,9])[0-9]{7}/, {
    message:
      "Primary Phone Number must be Airtel or MTN number formatted like 07*********",
  })
  @ApiProperty({
    description: "primary phone required",
  })
  phoneNumber: string;

  @IsNotEmpty()
  @ApiProperty({ description: "please enter Year of Birth" })
  dob: number;

  @IsNotEmpty()
  @ApiProperty({ description: "please enter new password" })
  password: string;
}
