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
import { HasRoles } from "../auth/has-roles.decorator";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RolesGuard } from "../auth/roles.guard";
import { BookingService } from "./booking.service";
import { BookingDto } from "./dto/bookings.dto";
import { Booking } from "./entity/booking.entity";
import { UserDto } from "src/user/user/dto/userDto";

@Controller("booking")
@ApiTags("booking")
export class BookingController {
  constructor(
    private bookingService: BookingService,
    private authService: AuthService,
    private filter: FilterHelper,
    private jwtService: JwtService,
  ) {}
  @Post("creation")
  @ApiBearerAuth()
  async createBooking(@Body() data: BookingDto, @Request() req) {
    // console.log(data)
    // const info = data.boat.toString();
    // const splits = info.split(",");
    // data.boat = parseInt(splits[0]);
    // data.user = parseInt(splits[1]);
    return this.bookingService.createBooking(data);
  }

  @Get("userbookings/:id")
  @ApiBearerAuth()
  async getUserBookings(@Param("id") id: number) {
    return this.bookingService.getUserBooking(id);
  }
  
  @ApiQuery({ required: false, name: "pageNumber" })
  @ApiQuery({ required: false, name: "pageSize" })
  @ApiQuery({ required: false, name: "search" })
  @HasRoles("skipper", "admin")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get("/all")
  @ApiBearerAuth()
  async getAllBookings(
    @Request() req,
    @Query("pageNumber") pageNumber: number,
    @Query("pageSize") pageSize: number,
  ) {
    // Returned filters can be passed to a Typeorm entity as House.find({where: filter})
    const booking = await this.filter.paginate(
      Booking,
      pageSize || 9,
      pageNumber || 1,
      {
        status: Not(8),
        // boat: { user: { id: req.user.userId } },
      },
      ["boat", "payment"],
    );
    console.log(req);
    return booking;
  }

  @ApiQuery({ required: false, name: "pageNumber" })
  @ApiQuery({ required: false, name: "pageSize" })
  @ApiQuery({ required: false, name: "search" })
  @HasRoles("skipper", "admin")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get("/toSpecific/boat/:id")
  @ApiBearerAuth()
  async getAllBookingsToSingleBoat(
    @Request() req,
    @Param("id") id: number,
    @Query("pageNumber") pageNumber: number,
    @Query("pageSize") pageSize: number,
  ) {
    // Returned filters can be passed to a Typeorm entity as House.find({where: filter})
    const booking = await this.filter.paginate(
      Booking,
      pageSize || 10,
      pageNumber || 1,
      {
        status: Not(8),
        boat: { id: id },
      },
      ["boat", "payment"],
    );
    console.log(req);
    return booking;
  }

  @ApiBearerAuth()
  @HasRoles("skipper", "admin")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(":id")
  getSingleBooking(@Param("id") id: number, @Request() req) {
    console.log();
    return this.bookingService.getSingleBooking(id);
  }

  @ApiBearerAuth()
  @HasRoles("skipper", "admin")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(":id")
  deleteBooking(@Param("id") id: number, @Request() req) {
    return this.bookingService.deleteBooking(id);
  }
  @ApiBearerAuth()
  @HasRoles("skipper")
  @UseGuards(JwtAuthGuard)
  @Get("")
  getBookingList(@Request() req) {
    return this.bookingService.findBookingForSkipper(req.user.userId);
  }

  @ApiBearerAuth()
  @Post("")
  generateRandomRows(@Request() req) {
    return this.bookingService.createBookings();
  }
}
