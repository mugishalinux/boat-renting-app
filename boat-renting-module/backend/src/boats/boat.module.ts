import { forwardRef, Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { JwtService } from "@nestjs/jwt";
import { ResponseModule } from "../response/response.module";

import { FilterHelper } from "../helpers/filter.helper";
import { UserService } from "../user/user/user.service";
import { BoatService } from "./boat.service";
import { UserModule } from "../user/user.module";
import { BoatController } from "./boat.controller";
import { LocationModule } from "../location/location.module";
import { RankModule } from "../rank/rank.module";

@Module({
  imports: [
    forwardRef(() => AuthModule),
    ResponseModule,
    LocationModule,
    UserModule,
    RankModule,
  ],
  controllers: [BoatController],
  providers: [UserService, BoatService, JwtService, FilterHelper],
  exports: [BoatService],
})
export class BoatModule {}
