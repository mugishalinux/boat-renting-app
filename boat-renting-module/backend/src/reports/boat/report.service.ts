import {
  BadRequestException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { Not } from "typeorm";
import { AuthService } from "../../auth/auth.service";
import { JwtService } from "@nestjs/jwt";
import { Boat } from "../../boats/entity/boat.entity";

export type Usa = any;
@Injectable()
export class BoatReportService {
  constructor() {}
  async countBoat(id: number) {
    return Boat.count({
      where: { status: Not(8), user: { id } },
    });
  }
}
