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
import { BoatService } from "./boat.service";
import { RegistrationBoatDto } from "./dto/registratio.boat";
import { Boat } from "./entity/boat.entity";
@Controller("boat")
@ApiTags("boat")
export class BoatController {
  constructor(
    private boatService: BoatService,
    private authService: AuthService,
    private filter: FilterHelper,
    private jwtService: JwtService,
  ) {}
  @Post("creation")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async createBoat(@Body() data: RegistrationBoatDto, @Request() req) {
    return this.boatService.createNewBoat(data);
  }

  @Get("test/:id")
  @ApiBearerAuth()
  async createAdmin(@Param("id") id: number) {
    return this.boatService.fetchAllBoat(id);
  }

  @ApiQuery({ required: false, name: "pageNumber" })
  @ApiQuery({ required: false, name: "pageSize" })
  @ApiQuery({ required: false, name: "search" })
  @HasRoles("skipper")
  @UseGuards(JwtAuthGuard)
  @Get("/all")
  @ApiBearerAuth()
  async getAllBoats(
    @Request() req,
    @Query("pageNumber") pageNumber: number,
    @Query("pageSize") pageSize: number,
  ) {
    // Returned filters can be passed to a Typeorm entity as House.find({where: filter})
    const boat = await this.filter.paginate(
      Boat,
      pageSize || 10,
      pageNumber || 1,
      {
        status: Not(8),
        user: { id: req.user.userId },
      },
      ["rank"],
    );
    console.log(req);
    return boat;
  }
  @ApiBearerAuth()
  @HasRoles("skipper")
  @UseGuards(JwtAuthGuard)
  @Get(":id")
  getSingleChannelModelById(@Param("id") id: number, @Request() req) {
    console.log();
    return this.boatService.getSingleBoat(id);
  }

  @ApiBearerAuth()
  @HasRoles("skipper")
  @UseGuards(JwtAuthGuard)
  @Get("")
  getAllBoat(@Request() req) {
    return this.boatService.getAllBoat(req.user.userId);
  }

  @ApiBearerAuth()
  @HasRoles("skipper")
  @UseGuards(JwtAuthGuard)
  @Put(":id")
  updatelocation(
    @Param("id") id: number,
    @Body() data: RegistrationBoatDto,
    userId: number,
    @Request() req,
  ) {
    return this.boatService.updateBoatInfo(id, data, req.user.userId);
  }
  @ApiBearerAuth()
  @HasRoles("skipper")
  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  deleteLocation(@Param("id") id: number, @Request() req) {
    return this.boatService.deleteBoat(id, req.user.userId);
  }
}
