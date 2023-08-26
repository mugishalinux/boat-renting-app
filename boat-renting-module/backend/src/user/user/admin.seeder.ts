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
  async onApplicationBootstrap(app: NestApplication) {
    //check if admin already registered
    const admin = await User.findOne({
      where: { primaryPhone: process.env.PHONE, status: Not(8) },
    });
    if (!admin) {
      const user = new User();
      user.firstName = process.env.NAMES;
      user.primaryPhone = process.env.PHONE;
      user.access_level = process.env.LEVEL;
      user.status = 1;
      user.profilePicture= "https://res.cloudinary.com/ded6s1sof/image/upload/v1687809731/cdivftwhgof0s85xcsgs.jpg";
      user.created_by = 1;
      user.updated_by = 1;
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(process.env.KEY, 12);
      user.password = hashedPassword;
      try {
        const data = await user.save();
        return this.response.postResponse(data.id);
      } catch (error) {
        console.log("something wrong : ", error);
      }
    } else {
      // console.log('admin exist');
    }
  }
}
