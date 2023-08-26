import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class LocationRegisterDto {
    @IsNotEmpty()
    @ApiProperty({
      description: "location name required",
    })
    locationName: string;
    @IsNotEmpty()
    @ApiProperty({
      description: "location image required",
    })
    locationImage: string;
  }
  