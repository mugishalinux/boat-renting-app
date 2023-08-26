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
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { AuthGuard } from "@nestjs/passport";
import { ApiBearerAuth, ApiQuery, ApiTags } from "@nestjs/swagger";
import { AuthService } from "../auth/auth.service";
import { FilterHelper } from "../helpers/filter.helper";
import { Not } from "typeorm";
import { LocationRegisterDto } from "./register.location";
import { HasRoles } from "../auth/has-roles.decorator";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RolesGuard } from "../auth/roles.guard";
import { LocationUpateDto } from "./update.dto";
import { RankService } from "./rank.service";
import { RegistrationBoatDto } from "./dto/registratio.boat";

@Controller("ranking")
@ApiTags("ranking")
export class RankController {
  constructor(
    private rankService: RankService,
    private authService: AuthService,
    private filter: FilterHelper,
    private jwtService: JwtService,
  ) {}
  @ApiBearerAuth()
  @Put("increment/:id")
  incrementRanking(@Param("id") id: number, @Request() req) {
    return this.rankService.incrementRank(id);
  }
  @ApiBearerAuth()
  @Put("decrement/:id")
  decrementRanking(@Param("id") id: number, @Request() req) {
    return this.rankService.decrementRank(id);
  }
}
