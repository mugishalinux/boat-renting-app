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
import { TransactionService } from "./transaction.service";

@Controller("transaction")
@ApiTags("transaction")
export class TransactionController {
  constructor(
    private transactionService: TransactionService,
    private authService: AuthService,
    private filter: FilterHelper,
    private jwtService: JwtService,
  ) {}

  @Post("/:externalRef/:amount/:client/:skipper")
  @ApiBearerAuth()
  async initiatePayment(
    @Param("externalRef") externalRef: number,
    @Param("amount") amount: number,
    @Param("client") client: number,
    @Param("skipper") skipper: number,
  ) {
    // console.log(client)
    // console.log(skipper)
    // console.log(amount)
    return this.transactionService.initiatePayment(
      externalRef,
      amount,
      client,
      skipper,
    );
  }
}
