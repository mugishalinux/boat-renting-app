import { forwardRef, Module } from "@nestjs/common";

import { PassportModule } from "@nestjs/passport";
import { AuthService } from "./auth.service";
import { LocalStrategy } from "./local.strategy";
import * as dotenv from "dotenv";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { UserService } from "../user/user/user.service";
import { UserModule } from "../user/user.module";
import { JwtStrategy } from "./jwt.strategy";
import { ResponseModule } from "../response/response.module";
import { RolesGuard } from "./roles.guard";

dotenv.config();
require("dotenv").config();
@Module({
  imports: [
    forwardRef(() => UserModule),
    PassportModule,
    ResponseModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      // secret: jwtConstants.secret,
      signOptions: { expiresIn: "10s" },
    }),
  ],
  providers: [AuthService, JwtService, UserService, LocalStrategy, JwtStrategy,RolesGuard],
  exports: [AuthService,RolesGuard],
})
export class AuthModule {}
