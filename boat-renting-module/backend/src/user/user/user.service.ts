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

export type Usa = any;
@Injectable()
export class UserService {
  constructor(private response: ResponseService) {}

  async createUsers(userData: RegisterDto) {
    const user = new User();
    const primaryPhone = await User.findOne({
      where: { primaryPhone: userData.phoneNumber, status: Not(8) },
    });
    if (primaryPhone)
      throw new BadRequestException(
        `This phone number ${userData.phoneNumber} already taken`,
      );
    user.firstName = userData.firstName;
    user.lastName = userData.lastName;
    user.dob = userData.dob;
    user.primaryPhone = userData.phoneNumber;
    user.access_level = userData.access_level;
    user.status = 2;
    user.created_by = 1;
    user.updated_by = 1;
    user.profilePicture = userData.profilePicture;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(userData.password, 12);
    user.password = hashedPassword;
    try {
      const data = await user.save();
      const supportingDoc = new SupportingDoc();
      supportingDoc.nationalId = userData.nationalIdentification;
      supportingDoc.rdbCertificate = userData.rdbCertificate;
      supportingDoc.user = data;
      await supportingDoc.save();
      return this.response.postResponse(data.id);
    } catch (error) {
      throw new InternalServerErrorException("something wrong : ", error);
    }
  }

  async createClient(userData: ClientDto) {
    const user = new User();
    const primaryPhone = await User.findOne({
      where: { primaryPhone: userData.phoneNumber, status: Not(8) },
    });
    if (primaryPhone)
      throw new BadRequestException(
        `This phone number ${userData.phoneNumber} already taken`,
      );
    user.firstName = userData.firstName;
    user.lastName = userData.lastName;
    user.access_level = "client";
    user.dob = userData.dob;
    user.primaryPhone = userData.phoneNumber;
    user.status = 1;
    user.created_by = 1;
    user.updated_by = 1;

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

  async getAllSkipper() {
    return User.find({
      where: { status: Not(8), access_level: Not("admin") },
    });
  }

  async getAllUsers() {
    return User.find({
      where: { status: Not(8) },
      relations: ["supportingDoc"],
    });
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

  async getSingleUser(id: number): Promise<User> {
    //check if a user exist
    const user = await User.findOne({
      where: { status: Not(8), id: id },
    });
    if (!user) throw new BadRequestException(`User with ID ${id} not found`);
    return user;
  }

  async upadateUserInfo(id: number, userData: UpdateUserDto) {
    const user = await User.findOne({
      where: { id },
    });
    if (!user) throw new BadRequestException(`User with ID: ${id} not found`);

    const isPhoneExist = await User.findOne({
      where: { id: Not(id), primaryPhone: userData.phoneNumber },
    });
    if (isPhoneExist)
      throw new BadRequestException(
        `Phone number ${userData.phoneNumber} already exist `,
      );
    user.firstName = userData.firstName;
    user.lastName = userData.lastName;
    user.primaryPhone = userData.phoneNumber;
    user.dob = userData.dob;
    try {
      const data = await User.update(id, user);
      return this.response.updateResponse(id);
    } catch (error) {
      throw new InternalServerErrorException("something wrong : ", error);
    }
  }

  async approveSkipperAccount(id: number) {
    const user = await User.findOne({
      where: { id },
    });
    if (!user) throw new BadRequestException(`User with ID: ${id} not found`);
    user.status = 1;
    try {
      const data = await User.update(id, user);
      return this.response.updateResponse(id);
    } catch (error) {
      throw new InternalServerErrorException("something wrong : ", error);
    }
  }
  async disableSkipperAccount(id: number) {
    const user = await User.findOne({
      where: { id },
    });
    if (!user) throw new BadRequestException(`User with ID: ${id} not found`);
    user.status = 2;
    try {
      const data = await User.update(id, user);
      return this.response.updateResponse(id);
    } catch (error) {
      throw new InternalServerErrorException("something wrong : ", error);
    }
  }

  async forgetPassword(userData: ForgetPasswordDto) {
    const user = await User.findOne({
      where: { primaryPhone: userData.phoneNumber },
    });
    if (!user)
      throw new BadRequestException(
        `User with Phone number: ${userData.phoneNumber} not found`,
      );
    try {
      const yearOfBirth = user.dob.getFullYear();
      if (yearOfBirth == userData.dob) {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(userData.password, 12);
        user.password = hashedPassword;
        try {
          const data = await User.update(user.id, user);
          return this.response.updateResponse(user.id);
        } catch (error) {
          throw new InternalServerErrorException("something wrong : ", error);
        }
      } else {
        return {
          statusCode: 400,
          message: "You provided incorrect year of birth",
        };
      }
    } catch (e) {
      console.log(e);
    }
  }

  async updatingPassword(id: number, password: string) {
    const user = await User.findOne({
      where: { id },
    });
    if (!user)
      throw new BadRequestException(`User with Phone number ${id} not found`);

    // console.log(user);

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, 12);
    user.password = hashedPassword;
    try {
      const data = await User.update(user.id, user);
      return this.response.postResponse(user.id);
    } catch (error) {
      throw new InternalServerErrorException("something wrong : ", error);
    }
  }

  async deleteUser(id: number) {
    //check if a user exist
    const user = await User.findOne({ where: { status: Not(8), id: id } });
    if (!user) throw new BadRequestException(`User with ID ${id} not found`);
    try {
      user.status = 8;
      await User.update(user.id, user);
      return this.response.deleteResponse(user.id);
    } catch (error) {
      throw new InternalServerErrorException("something wrong : ", error);
    }
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
