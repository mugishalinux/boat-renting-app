import { forwardRef, Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { JwtService } from "@nestjs/jwt";
import { ResponseModule } from "../response/response.module";

import { FilterHelper } from "../helpers/filter.helper";
import { UserService } from "../user/user/user.service";
import { RankService } from "./rank.service";
import { UserModule } from "../user/user.module";
import { RankController } from "./rank.controller";
import { LocationModule } from "../location/location.module";

@Module({
  imports: [
    forwardRef(() => AuthModule),
    ResponseModule,
    LocationModule,
    UserModule,
  ],
  controllers: [RankController],
  providers: [UserService, RankService, JwtService, FilterHelper],
  exports: [RankService],
})
export class RankModule {}
