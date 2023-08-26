import {
  BadRequestException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { Not } from "typeorm";
import e from "express";
import { ResponseService } from "../response/response.service";
import { BookingDto } from "./dto/bookings.dto";
import { Booking } from "./entity/booking.entity";
import { Boat } from "../boats/entity/boat.entity";
import { User } from "../user/user/entity/user.entity";
import { userInfo } from "os";
import { BookingReportDto } from "./dto/booking.report.dto";
export type Usa = any;
@Injectable()
export class BookingService {
  constructor(private response: ResponseService) {}

  async createBooking(data: BookingDto) {
    const booking = new Booking();
    //checking if boat exist
    const boat = await Boat.findOne({
      where: { status: Not(8), id: data.boat },
    });
    if (!boat)
      throw new BadRequestException(`This boat ${data.boat} not found`);
    //checking if user exist
    const user = await User.findOne({
      where: { status: Not(8), id: data.user },
    });
    if (!user)
      throw new BadRequestException(`This user ${data.user} not found`);

    const amount = boat.price * data.diffHours;

    booking.user = user;
    booking.boat = boat;
    booking.bookingDate = data.bookingDate;
    booking.bookingFrom = data.bookingFrom;
    booking.bookingTo = data.bookingTo;
    booking.created_by = 1;
    booking.updated_by = 1;
    booking.status = 1;
    booking.names = data.names;
    booking.phoneNumber = data.phone;

    var ref = "";

    while (ref.length < 6) {
      var randomNumber = Math.floor(Math.random() * 10);

      if (ref.indexOf(randomNumber.toString()) === -1) {
        ref += randomNumber.toString();
      }
    }

    booking.bookingRef = parseInt(ref, 10);

    try {
      const data = await booking.save();
      return {
        bookingId: data.id,
        amountTobePaid: amount,
      };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException("something wrong : ", error);
    }
  }
  async getSingleBooking(id: number) {
    const booking = await Booking.findOne({
      relations: {
        boat: true,
        payment: true,
      },
      where: { status: Not(8), id: id },
    });
    if (!booking) throw new BadRequestException(`This booking ${id} not found`);
    return booking;
  }

  async getUserBooking(id: number) {
    const user = await User.findOne({
      where: { status: Not(8), id: id },
    });
    if (!user) throw new BadRequestException(`This User ${id} not found`);

    const booking = await Booking.find({
      relations: {
        payment: true,
      },
      where: { status: Not(8), user: { id } },
    });

    const bookingReportList: BookingReportDto[] = [];

    for (let i = 0; i < booking.length; i++) {
      const data = new BookingReportDto();
      data.id = booking[i].id;
      data.bookingRef = booking[i].bookingRef;
      data.bookingDate = booking[i].bookingDate;
      data.bookingFrom = booking[i].bookingFrom;
      data.bookingTo = booking[i].bookingTo;
      data.names = booking[i].names;
      data.phoneNumber = booking[i].phoneNumber;
      if (booking[i].payment != null || booking[i].payment != undefined) {
        data.paymentStatus = booking[i].payment.paymentStatus;
      } else {
        data.paymentStatus = null;
      }
      bookingReportList.push(data);
    }
    return bookingReportList;
  }
  async deleteBooking(id: number) {
    const booking = await Booking.findOne({
      relations: {
        boat: true,
      },
      where: { status: Not(8), id: id },
    });
    if (!booking) throw new BadRequestException(`This booking ${id} not found`);
    try {
      booking.status = 8;
      booking.updated_by = 1;
      await Booking.update(id, booking);
      return this.response.deleteResponse(id);
    } catch (error) {
      throw new InternalServerErrorException("something wrong : ", error);
    }
  }

  async createBookings() {
    // Generate 1000 booking records
    const bookings: Booking[] = [];

    for (let i = 1; i <= 500; i++) {
      const booking = new Booking();
      booking.bookingRef = Math.floor(Math.random() * 1000000) + 1; // Generate random bookingRef
      booking.bookingDate = this.generateRandomDate(); // Generate random bookingDate
      const bookingFromValue = Math.floor(Math.random() * 11) + 7;
      booking.bookingFrom = bookingFromValue.toString(); // Generate random bookingFrom (between 7 and 17)
      booking.bookingTo =
        Math.floor(Math.random() * 11) + booking.bookingFrom + 1; // Generate random bookingTo (greater than bookingFrom)
      booking.status = 1;
      booking.names = this.generateRandomName(); // Generate random name
      booking.phoneNumber = this.generateRandomPhoneNumber(); // Generate random phoneNumber
      booking.created_by = 1;
      booking.updated_by = 1;
      booking.created_at = this.generateRandomPastDate(); // Generate random created_at (within the past year)
      booking.updated_at = new Date(); // Set updated_at to current date

      const boat = await Boat.findOne({
        where: { status: Not(8), id: Math.floor(Math.random() * 5) + 1 },
      });

      booking.boat = boat;
      booking.user = null;
      await Booking.save(booking);
    }

    // Insert the booking records into the database
    await Booking.save(bookings);
  }

  private generateRandomDate(): Date {
    const startDate = new Date(2020, 5, 20); // June 20, 2020
    const endDate = new Date(); // Current date
    const randomTimestamp =
      Math.random() * (endDate.getTime() - startDate.getTime()) +
      startDate.getTime();
    return new Date(randomTimestamp);
  }

  private generateRandomPastDate(): Date {
    const startDate = new Date(2020, 5, 20); // June 20, 2020
    const endDate = new Date(); // Current date
    const randomTimestamp =
      Math.random() * (endDate.getTime() - startDate.getTime()) +
      startDate.getTime();
    return new Date(randomTimestamp);
  }

  private generateRandomName(): string {
    const names = ["John Doe", "Jane Smith", "Mike Johnson"];
    const randomIndex = Math.floor(Math.random() * names.length);
    return names[randomIndex];
  }

  private generateRandomPhoneNumber(): string {
    const phoneNumber = Math.floor(Math.random() * 1000000000)
      .toString()
      .padStart(10, "0");
    return phoneNumber;
  }

  async getAllBookings() {
    return Booking.query(`SELECT
    b.*,
    p. "paymentStatus",
    p. "iniPaymentRef",
    p. "extPaymentRef",
    p. "accountNumber",
    p.created_at
  FROM
    booking b
    LEFT JOIN payment p ON b.id = p. "bookingId"
  WHERE
    b.status != ${8}`);
  }
  async findBookingForSkipper(id: number) {
    return Booking.query(`SELECT
    b.*,
    p. "paymentStatus",
    p. "iniPaymentRef",
    p. "extPaymentRef",
    p. "accountNumber",
    p.created_at
  FROM
    booking b
    LEFT JOIN payment p ON b.id = p. "bookingId"
    INNER JOIN boat bo ON b. "boatId" = bo.id
  WHERE
    b.status <> ${8}
    AND bo. "userId" = ${id};`);
  }
}
