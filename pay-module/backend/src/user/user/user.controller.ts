import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Request,
  Post,
  Put,
  Query,
  UnauthorizedException,
  UseGuards,
  HttpException,
  HttpStatus,
  ConsoleLogger,
  ForbiddenException,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { LoginDto } from "./dto/login.dto";
import { UserDto } from "./dto/userDto";
import { User } from "./entity/user.entity";
import { UserService } from "./user.service";
import { ApiBearerAuth, ApiQuery, ApiTags } from "@nestjs/swagger";
import { LocalAuthGuard } from "../../auth/local-auth.guard";
import { AuthService } from "../../auth/auth.service";
import { Not } from "typeorm";
import { JwtService } from "@nestjs/jwt";
import { JwtAuthGuard } from "../../auth/jwt-auth.guard";
import { ResetPassword } from "./dto/reset-password.dto";
import { HasRoles } from "../../auth/has-roles.decorator";
import { RolesGuard } from "../../auth/roles.guard";
import { Role } from "./enums/role";
import { FilterHelper } from "../../helpers/filter.helper";
import { SubscriberDto } from "./dto/subscriber.dto";
import { RegisterDto } from "./dto/register.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { ForgetPasswordDto } from "./dto/forget.password";
import { ClientDto } from "./dto/client.dto";
import { Transaction } from "./entity/transcation.entity";

@Controller("user")
@ApiTags("user")
export class UserController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
    private filter: FilterHelper,
    private jwtService: JwtService,
  ) {}

  @Post("createAccount")
  @ApiBearerAuth()
  async createSkipper(@Body() userDto: RegisterDto) {
    userDto.access_level = "client";
    return this.userService.createUsers(userDto);
  }

  @ApiBearerAuth()
  @Get("/transaction/list/:id")
  async getAllTransaction(@Param("id") id: number) {
    const user = await User.findOne({ where: { id } });
    if (!user) {
      throw new BadRequestException("User Not Found");
    }
    const transaction = await Transaction.find({
      where: {
        user: { id: user.id },
      },
      relations: ["user"],
    });
    return transaction;
  }

  @ApiBearerAuth()
  @Get("/info/:id")
  async getUserInfo(@Param("id") id: number) {
    const user = await User.findOne({ where: { id } });
    if (!user) {
      throw new BadRequestException("User Not Found");
    }

    return user;
  }

  @ApiBearerAuth()
  @HasRoles("admin")
  @UseGuards(JwtAuthGuard)
  @Get("all/:role")
  getAllUserByAccessLevel(@Param("role") role: string) {
    return this.userService.getAllUsersByAccessLevel(role);
  }
  @ApiBearerAuth()
  @HasRoles("admin")
  @Get("/:phone")
  getSingleAccount(@Param("phone") phone: string) {
    return this.userService.getAccount(phone);
  }
  @ApiBearerAuth()
  @HasRoles("admin")
  @Get("byAccounNumber/:card")
  getSingleAccountByCardNumber(@Param("card") card: string) {
    return this.userService.getAccountByAccountNumber(card);
  }
  @ApiBearerAuth()
  @HasRoles("admin")
  @Get("byAccounNumberInfo/:card")
  getSingleAccountByCardNumbers(@Param("card") card: string) {
    return this.userService.getAccountByAccountNumber(card);
  }

  @ApiBearerAuth()
  @HasRoles("admin")
  @Get("userInfo/:cardInfo")
  getUserAccountInfo(@Param("cardInfo") cardInfo: string) {
    const arrayOfNames = cardInfo.split(",");
    console.log(arrayOfNames);
    // return this.userService.getAccountByAccountNumber(card);
  }

  @ApiBearerAuth()
  @HasRoles("admin")
  @Get("verifyCard/:card/:cvv/:expire")
  verifyCard(
    @Param("card") card: string,
    @Param("cvv") cvv: string,
    @Param("expire") expire: string,
  ) {
    return this.userService.verifyCard(card, cvv, expire);
  }

  @ApiBearerAuth()
  @HasRoles("admin")
  @Get("phone/:phone")
  async getUserAccountByPhoneNumber(@Param("phone") phone: string) {
    const user = await User.findOne({ where: { primaryPhone: phone } });
    if (!user) {
      throw new BadRequestException(`user with : ${phone} not found`);
    }
    return user;
  }

  @ApiBearerAuth()
  @Post("auth/login/user")
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser(
      loginDto.phone,
      loginDto.password,
    );
    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const data = await User.findOne({ where: { id: user.id } });
    const payload = { id: user.id, names: user.names };
    const jwtToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET,
    });

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: user.id,
          names: user.lastName + " " + user.firstName,
          phone: user.primaryPhone,
          access_level: user.access_level,
          profile: user.profilePicture,
          jwtToken,
        });
      }, 0); // Delay the response by 3 seconds
    });
  }
}
