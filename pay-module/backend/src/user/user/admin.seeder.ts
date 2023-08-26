import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { NestApplication } from "@nestjs/core";
import * as dotenv from "dotenv";
import * as bcrypt from "bcrypt";
import { User } from "../user/entity/user.entity";
import { ResponseService } from "../../response/response.service";
import { Not } from "typeorm";
dotenv.config();
require("dotenv").config();

@Injectable()
export class AdminSeeder {
  constructor(private response: ResponseService) {}
  async onApplicationBootstrap(app: NestApplication) {}
}
