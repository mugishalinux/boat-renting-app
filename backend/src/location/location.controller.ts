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
import { LocationService } from "./location.service";
import { LocationRegisterDto } from "./register.location";
import { HasRoles } from "../auth/has-roles.decorator";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RolesGuard } from "../auth/roles.guard";
import { Location } from "./entity/location.entity";
import { LocationUpateDto } from "./update.dto";
@Controller("location")
@ApiTags("location")
export class LocationController {
  constructor(
    private locationService: LocationService,
    private authService: AuthService,
    private filter: FilterHelper,
    private jwtService: JwtService,
  ) {}
  @HasRoles("admin")
  @Post("creation")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async createLocation(@Body() data: LocationRegisterDto, @Request() req) {
    return this.locationService.createLocation(data, req.user.userId);
  }
  @ApiQuery({ required: false, name: "pageNumber" })
  @ApiQuery({ required: false, name: "pageSize" })
  @ApiQuery({ required: false, name: "search" })
  @HasRoles("admin")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  async getAllLocation(
    @Request() req,
    @Query("pageNumber") pageNumber: number,
    @Query("pageSize") pageSize: number,
  ) {
    // Returned filters can be passed to a Typeorm entity as House.find({where: filter})
    const location = await this.filter.paginate(
      Location,
      pageSize || 10,
      pageNumber || 1,
      {
        status: Not(8),
      },
    );
    console.log(req);
    return location;
  }
  @ApiBearerAuth()
  @HasRoles("admin")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(":id")
  getSingleChannelModelById(@Param("id") id: number, @Request() req) {
    console.log();
    return this.locationService.getSingleLocation(id);
  }

  @ApiBearerAuth()
  @Get("")
  getSingleAllLocation() {
    console.log("hitted");
    return this.locationService.getAllLocations();
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put(":id")
  updatelocation(
    @Param("id") id: number,
    @Body() data: LocationUpateDto,
    @Request() req,
  ) {
    return this.locationService.updateLocation(id, data, req.user.userId);
  }
  @ApiBearerAuth()
  @HasRoles("admin")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(":id")
  deleteLocation(@Param("id") id: number, @Request() req) {
    return this.locationService.deleteLocation(id, req.user.userId);
  }
}
