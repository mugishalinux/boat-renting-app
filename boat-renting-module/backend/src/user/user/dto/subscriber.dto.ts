import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsOptional, Matches } from "class-validator";
import { BaseEntity, BeforeInsert } from "typeorm";

export class SubscriberDto extends BaseEntity {
  @IsNotEmpty()
  @ApiProperty({
    description: "names required",
  })
  names: string;
  @IsNotEmpty()
  @ApiProperty({
    description: "province id required",
  })
  province: number;
  // @IsNotEmpty()
  @ApiProperty({
    description: "district id required",
  })
  district: number;
  // @IsNotEmpty()
  @ApiProperty({
    description: "sector id required",
  })
  sector: number;
  // @IsNotEmpty()
  @ApiProperty({
    description: "cell id required",
  })
  cell: number;
  // @IsNotEmpty()
  @ApiProperty({
    description: "village id required",
  })
  village: number;
  @IsNotEmpty()
  @ApiProperty({
    description: "martial status required",
  })
  martialStatus: string;
  @IsOptional()
  @ApiProperty({
    description: "number of childreen required",
  })
  childreenNumber: number;
  @IsNotEmpty()
  @Matches(/(07[8,2,3,9])[0-9]{7}/, {
    message:
      "Primary Phone Number must be Airtel or MTN number formatted like 07*********",
  })
  @ApiProperty({
    description: "primary phone required",
  })
  primaryPhone: string;
  @IsOptional()
  @Matches(/(07[8,2,3,9])[0-9]{7}/, {
    message:
      "Secondary Phone Number must be Airtel or MTN number formatted like 07*********",
  })
  @ApiProperty({
    description: "secondary phone",
  })
  secondaryPhone: string;
  @IsNotEmpty()
  @ApiProperty({
    description: "choose receive two or one message on daily basis",
  })
  messageNumber: number;
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
  @IsNotEmpty()
  @ApiProperty({
    description: "time of receiving message",
  })
  messageTime: string;
  @IsOptional()
  @ApiProperty({
    description: "husband get message yes or no",
  })
  bothReceiveMessage: boolean;
}
