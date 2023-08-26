import { forwardRef, Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { UserController } from "./user/user.controller";
import { UserService } from "./user/user.service";
import { JwtService } from "@nestjs/jwt";
import { ResponseModule } from "../response/response.module";

import { FilterHelper } from "../helpers/filter.helper";
import { AdminSeeder } from "./user/admin.seeder";
import { RandomNumberService } from "./user/random.service";
import { TransactionService } from "./user/transaction.service";
import { TransactionController } from "./user/transaction.ts.controller";
import { UserAccountController } from "./user/user.controller.account";

@Module({
  imports: [forwardRef(() => AuthModule), ResponseModule],
  controllers: [UserController, TransactionController,UserAccountController],
  providers: [
    UserService,
    JwtService,
    AdminSeeder,
    RandomNumberService,
    FilterHelper,
    TransactionService,
  ],
  exports: [UserService, TransactionService, RandomNumberService, AdminSeeder],
})
export class UserModule {}
