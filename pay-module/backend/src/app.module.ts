import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { HttpModule } from "@nestjs/axios";
import { AppService } from "./app.service";
import { AppController } from "./app.controller";
import { MulterModule } from "@nestjs/platform-express";
import { ConfigModule } from "@nestjs/config";
import { User } from "./user/user/entity/user.entity";
import { AuthService } from "./auth/auth.service";
import { AuthModule } from "./auth/auth.module";
import { JwtService } from "@nestjs/jwt";
import { UserModule } from "./user/user.module";
import { APP_GUARD } from "@nestjs/core";
import { RolesGuard } from "./auth/roles.guard";
import { FilterHelper } from "./helpers/filter.helper";

import { ScheduleModule } from "@nestjs/schedule";
import { BullModule } from "@nestjs/bull";
import { ResponseModule } from "./response/response.module";
import { SupportingDoc } from "./user/user/entity/other.doc.entity";
import { Transaction } from "./user/user/entity/transcation.entity";

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot(),
    MulterModule.register({
      dest: "./imageFiles",
    }),
    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_DB,
      entities: [User, Transaction, SupportingDoc],
      logging: false,
      synchronize: true,
      // logging:true
    }),
    // PeriodsModule,
    HttpModule,
    AuthModule,
    UserModule,
    ResponseModule,
    // LocationModule,
  ],
  controllers: [AppController],
  providers: [AppService, AuthService, JwtService, FilterHelper],
})
export class AppModule {}
