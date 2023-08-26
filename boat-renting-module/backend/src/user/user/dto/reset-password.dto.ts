import { IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class ResetPassword {
  @IsNotEmpty()
  @ApiProperty({
    description: 'password required',
  })
  password: string;
}
