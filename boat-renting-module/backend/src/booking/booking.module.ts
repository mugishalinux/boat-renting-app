import { forwardRef, Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { JwtService } from "@nestjs/jwt";
import { ResponseModule } from "../response/response.module";

import { FilterHelper } from "../helpers/filter.helper";
import { UserService } from "../user/user/user.service";
import { BookingService } from "./booking.service";
import { BoatModule } from "../boats/boat.module";
import { BookingController } from "./booking.controller";


@Module({
  imports: [forwardRef(() => AuthModule), ResponseModule, BoatModule],
  controllers: [BookingController],
  providers: [BookingService, UserService, JwtService, FilterHelper],
  exports: [BookingService,],
})
export class BookingModule {}
