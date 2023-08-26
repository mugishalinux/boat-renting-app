import {
  BadRequestException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { Not } from "typeorm";

import { Booking } from "../../booking/entity/booking.entity";
import { AuthService } from "../../auth/auth.service";
import { JwtService } from "@nestjs/jwt";

export type Usa = any;
@Injectable()
export class BookingReportService {
  constructor() {}
  async countBookingsBySkipper(id: number) {
    return Booking.count({
      where: { status: Not(8), boat: { user: { id } } },
    });
  }
}
