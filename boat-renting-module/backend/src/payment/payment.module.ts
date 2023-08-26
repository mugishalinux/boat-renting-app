import { forwardRef, Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { JwtService } from "@nestjs/jwt";
import { ResponseModule } from "../response/response.module";

import { FilterHelper } from "../helpers/filter.helper";
import { UserService } from "../user/user/user.service";
import { BoatModule } from "../boats/boat.module";
import { PaymentController } from "./payment.controller/payment.controller";
import { PaymentService } from "./payment.service/payment.service";
import { ReferencesService } from "./references.generator";

@Module({
  imports: [forwardRef(() => AuthModule), ResponseModule, BoatModule],
  controllers: [PaymentController],
  providers: [PaymentService, UserService, JwtService,ReferencesService, FilterHelper],
  exports: [],
})
export class PaymentModule {}
