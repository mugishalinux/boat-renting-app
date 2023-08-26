import { forwardRef, Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { JwtService } from "@nestjs/jwt";
import { ResponseModule } from "../response/response.module";
import { PaymentReportService } from "./payments/report.service";
import { ReportController } from "./payments/report.controller";
import { BookingReportController } from "./bookings/report.controller";
import { BookingReportService } from "./bookings/report.service";
import { BoatReportController } from "./boat/report.controller";
import { BoatReportService } from "./boat/report.service";

@Module({
  imports: [forwardRef(() => AuthModule), ResponseModule],
  controllers: [ReportController, BookingReportController,BoatReportController],
  providers: [PaymentReportService, BookingReportService, JwtService,BoatReportService],
  exports: [],
})
export class ReportModule {}
