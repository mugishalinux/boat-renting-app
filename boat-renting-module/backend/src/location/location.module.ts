import { forwardRef, Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { JwtService } from "@nestjs/jwt";
import { ResponseModule } from "../response/response.module";

import { FilterHelper } from "../helpers/filter.helper";
import { LocationService } from "./location.service";
import { LocationController } from "./location.controller";
import { UserService } from "../user/user/user.service";

@Module({
  imports: [forwardRef(() => AuthModule), ResponseModule],
  controllers: [LocationController,],
  providers: [
    UserService,
    LocationService,
    JwtService,
    FilterHelper,
  ],
  exports: [],
})
export class LocationModule {}
