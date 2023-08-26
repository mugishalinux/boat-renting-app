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
  Req,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { AuthGuard } from "@nestjs/passport";
import { ApiBearerAuth, ApiQuery, ApiTags } from "@nestjs/swagger";
import { FilterHelper } from "../../helpers/filter.helper";
import { Not } from "typeorm";
import { AccountDto } from "./dto/account.dto";
@Controller("user-account")
@ApiTags("user-account")
export class UserAccountController {
  constructor(private filter: FilterHelper, private jwtService: JwtService) {}
  @Post("")
  @ApiBearerAuth()
  async userAccountVerify(@Body() data: AccountDto) {
    console.log(data);
  }
}
