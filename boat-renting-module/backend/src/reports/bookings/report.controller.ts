import { Controller, Get, Request, UseGuards } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { AuthGuard } from "@nestjs/passport";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../../auth/jwt-auth.guard";
import { AuthService } from "../../auth/auth.service";

import { BookingReportService } from "./report.service";

@Controller("bookingReports")
@ApiTags("bookingReports")
export class BookingReportController {
  constructor(
    private authService: AuthService,
    private reportService: BookingReportService,
    private jwtService: JwtService,
  ) {}
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get("count")
  async countPayments(@Request() req) {
    const count = await this.reportService.countBookingsBySkipper(
      req.user.userId,
    );
    return count;
  }
}
