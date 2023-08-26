import { IsNotEmpty, Matches } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class LocationUpateDto {
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
