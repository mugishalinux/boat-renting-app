import { Controller, Get, Request, UseGuards } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { AuthGuard } from "@nestjs/passport";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../../auth/jwt-auth.guard";
import { AuthService } from "../../auth/auth.service";
import { BoatReportService } from "./report.service";

@Controller("boatReports")
@ApiTags("boatReports")
export class BoatReportController {
  constructor(
    private authService: AuthService,
    private reportService: BoatReportService,
    private jwtService: JwtService,
  ) {}
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get("count")
  async countPayments(@Request() req) {
    const count = await this.reportService.countBoat(req.user.userId);
    return count;
  }
}
