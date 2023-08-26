import {
  BadRequestException,
  ForbiddenException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { UserDto } from "./dto/userDto";
import { User } from "./entity/user.entity";
import { LoginDto } from "./dto/login.dto";
import { Not } from "typeorm";
import * as bcrypt from "bcrypt";
import { ResponseService } from "../../response/response.service";
import { SubscriberDto } from "./dto/subscriber.dto";

import e from "express";
import { RegisterDto } from "./dto/register.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { ForgetPasswordDto } from "./dto/forget.password";
import { SupportingDoc } from "./entity/other.doc.entity";
import { ClientDto } from "./dto/client.dto";
import { RandomNumberService } from "./random.service";

export type Usa = any;
@Injectable()
export class UserService {
  constructor(
    private response: ResponseService,
    private randomService: RandomNumberService,
  ) {}

  async createUsers(userData: RegisterDto) {
    const user = new User();
    const primaryPhone = await User.findOne({
      where: { primaryPhone: userData.phoneNumber, status: Not(8) },
    });
    if (primaryPhone)
      throw new BadRequestException(
        `This phone number ${userData.phoneNumber} already taken`,
      );
    const email = await User.findOne({
      where: { email: userData.email, status: Not(8) },
    });
    if (email)
      throw new BadRequestException(
        `This Email ${userData.email} already taken`,
      );
    user.firstName = userData.firstName;
    user.accountNumber = this.randomService.generateCardNumber();
    user.cvv = this.randomService.generateCvvNumber();
    user.expirationCode = this.randomService.generateExpirationDate();
    user.balance = 40000;
    user.lastName = userData.lastName;
    user.dob = userData.dob;
    user.primaryPhone = userData.phoneNumber;
    user.access_level = userData.access_level;
    user.status = 1;
    user.created_by = 1;
    user.updated_by = 1;
    user.email = userData.email;
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(userData.password, 12);
    user.password = hashedPassword;
    try {
      const data = await user.save();
      return this.response.postResponse(data.id);
    } catch (error) {
      throw new InternalServerErrorException("something wrong : ", error);
    }
  }
  async getAccount(primaryPhone: string) {
    const user = await User.findOne({ where: { primaryPhone } });
    if (!user) throw new BadRequestException(`This user not found `);
    return user;
  }
  async getAccountByAccountNumber(accountNumber: string) {
    const user = await User.findOne({ where: { accountNumber } });
    if (!user) throw new BadRequestException(`This user not found `);
    return user;
  }

  async verifyCard(accountNumber: string, cvv: string, expirationCode: string) {
    const user = await User.findOne({
      where: { accountNumber, cvv, expirationCode },
    });
    if (!user) throw new BadRequestException(`Wrong Card`);
    return user;
  }

  async getAllUsersByAccessLevel(role: string) {
    return User.find({
      where: { status: Not(8), access_level: role },
      relations: ["supportingDoc"],
    });
  }

  async getAllAdmin() {
    return User.find({
      where: { status: Not(8), access_level: Not("skipper") },
    });
  }

  async findUserByPhoneBeforeCreateUser(phone: string): Promise<User> {
    return await User.findOne({
      where: { primaryPhone: phone, status: Not(8) },
    });
  }
  async findUserByPhone(phone: string): Promise<User> {
    const user = await User.findOne({
      where: { primaryPhone: phone, status: Not(8) },
    });
    if (!user)
      throw new BadRequestException(`This account doesn't ${phone} exist`);
    return user;
  }
}
