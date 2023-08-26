import { Controller, Get, Query, Request, Res, UseGuards } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { AuthGuard } from "@nestjs/passport";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../../auth/jwt-auth.guard";
import { AuthService } from "../../auth/auth.service";
import { Response } from 'express';
import { PaymentReportService } from "./report.service";

@Controller("paymentReports")
@ApiTags("paymentReports")
export class ReportController {
  constructor(
    private authService: AuthService,
    private reportService: PaymentReportService,
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
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get("calculate")
  async generatePayments(@Request() req) {
    const count = await this.reportService.countTotalAmoutPayments(
      req.user.userId,
    );
    return count;
  }
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get("calculateDailyIncome")
  async dailyIncomeTotalAverage(@Request() req) {
    const count = await this.reportService.dailyAverageIncome(req.user.userId);
    return count;
  }
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get("calculateTodayIncome")
  async currentlyTotalIncome(@Request() req) {
    const count = await this.reportService.calculateTodayIncome(
      req.user.userId,
    );
    return count;
  }
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get("calculateTodayPercentage")
  async generateDailyPercentage(@Request() req) {
    const count = await this.reportService.getTodaysPercentage(req.user.userId);
    return count;
  }
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get("sixMonthsAgo")
  async sixMonthsAgoReport(@Request() req) {
    const count = await this.reportService.totalAmountEarnedLast6Months(
      req.user.userId,
    );
    return count;
  }

  @Get("image")
  async generateImage(
    @Query('quote') quote: string,
    @Res() res: Response,
  ): Promise<void> {
    const imageBuffer = await this.reportService.generateImageWithQuote(quote);

    res.set('Content-Type', 'image/png');
    res.send(imageBuffer);
  }
}
