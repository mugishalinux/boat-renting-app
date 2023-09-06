import {
  BadRequestException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { Not } from "typeorm";
import e from "express";
import { ResponseService } from "../../response/response.service";
import { Payment } from "../entity/payment.entity";
import { Booking } from "../../booking/entity/booking.entity";
import { PaymentDto } from "../dto/payment.dto";
import { ReferencesService } from "../references.generator";
import { User } from "../../user/user/entity/user.entity";

import * as dotenv from "dotenv";
dotenv.config();
require("dotenv").config();
import * as nodemailer from "nodemailer";

import axios from "axios";
import { AccountDto } from "../dto/account.dto";
import { Boat } from "src/boats/entity/boat.entity";
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
@Injectable()
export class PaymentService {
  private readonly transporter;
  constructor(
    private response: ResponseService,
    private referencesServices: ReferencesService,
  ) {
    this.transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.SMTPUSERNANE,
        pass: process.env.SMTPEMAIL, // Use your Gmail app password here
      },
    });
  }

  async initiatePayment(data: PaymentDto) {
    //check if card is exist

    const accountDto = new AccountDto();
    accountDto.card = data.card;
    accountDto.cvv = data.cvv;
    const expire = data.expire.split("/");

    const userInfo = data.card + "," + data.cvv + "," + data.expire;
    const info = String(userInfo);
    try {
      const response = await axios.get(
        `http://localhost:7000/user/verifyCard/${data.card}/${data.cvv}/${expire[0]}%2F${expire[1]}
        `,
      );
      console.log("user found card valid");
    } catch (e) {
      console.log(e.message);
      throw new BadRequestException("Invalid Card");
    }

    const payment = new Payment();
    //checking if booking exist
    const booking = await Booking.findOne({
      where: { status: Not(8), id: data.booking },
      relations: ["boat"],
    });
    if (!booking)
      throw new BadRequestException(`This booking ${data.booking} not found`);

    const user = await User.findOne({
      where: { status: Not(8), id: data.user },
    });
    if (!user)
      throw new BadRequestException(`This booking ${data.user} not found`);

    const userSkipperInfo = await User.findOne({
      where: { boat: { id: booking.boat.id } },
    });

    payment.booking = booking;
    payment.user = user;
    payment.amount = data.amount;
    payment.paymentStatus = "pending";
    payment.iniPaymentRef = parseInt(
      await this.referencesServices.generateInternalRefId(),
      10,
    );
    payment.extPaymentRef = parseInt(
      await this.referencesServices.generateInternalRefId(),
      10,
    );
    payment.accountNumber = data.card;
    payment.status = 1;
    payment.created_by = 1;
    payment.updated_by = 1;

    //get user skipper id
    let skipperId = 0;
    try {
      const response = await axios.get(
        `http://localhost:7000/user/phone/${userSkipperInfo.primaryPhone}`,
      );
      // console.log("user skipper found");
      // console.log(response.data);
      skipperId = response.data.id;
    } catch (e) {
      console.log(e.message);
      throw new BadRequestException(e.message);
    }
    //end
    //get user user id
    let userId = 0;
    let userEmail = "";
    let userLastName = "";
    try {
      const response = await axios.get(
        `http://localhost:7000/user/byAccounNumber/${accountDto.card}`,
      );
      // console.log("user client found");
      // console.log(response.data);
      userId = response.data.id;
      userEmail = response.data.email;
      userLastName = response.data.lastName;
      console.log("Balance of user " + response.data.balance);
      if (payment.amount > response.data.balance) {
        throw new BadRequestException("Insufficient balance");
      }
    } catch (e) {
      console.log(e.message);
      throw new BadRequestException(e.message);
    }
    //end

    try {
      const data = await payment.save();
      const initiatePayment = ` http://localhost:7000/transaction/${payment.iniPaymentRef}/${payment.amount}/${userId}/${skipperId}`;

      try {
        const response = await axios.post(initiatePayment);

        if (response.status == 201) {
          //send booking confirmation email
          try {
            // const userInfo = await User.findOne({
            //   where: { boat: { id: booking.boat.id } },
            // });

            // Send email
            const info1 = await this.transporter.sendMail({
              from: process.env.SMTPUSERNANE,
              to: userEmail,
              subject: "Booking Confirmation",
              text:
                "\n" +
                "\n" +
                "Dear " +
                userLastName +
                "\n" +
                "You have successfully booked a boat \n" +
                "Booking Information \n" +
                "Booking Id : " +
                booking.id +
                " \n " +
                "Booking Date : " +
                booking.bookingDate +
                " \n " +
                "Booking Hour From : " +
                booking.bookingFrom +
                " \n " +
                "Booking Hour To : " +
                booking.bookingTo +
                " \n " +
                "Booking Reference Id : " +
                booking.bookingRef +
                " \n " +
                "for your booking",
            });

            console.log("Email sent:", info1.response);
          } catch (error) {
            console.error("Error sending email:", error);
            throw new Error("Email could not be sent");
          }

          return {
            HttpStatus: 200,
            message: "payment done successfully",
          };
        } else if (response.status == 400) {
          console.log("meet problem");
          return {
            HttpStatus: 400,
            message: response.data.message,
          };
        }
        // Handle the response here if needed
        console.log(`payment done successfully`);
      } catch (error) {
        // Handle errors here
        return {
          HttpStatus: 400,
          message: "payment done failed",
        };
        console.log(`user not found by card : invalid card`);
        throw new BadRequestException("Invalid card number");
      }

      return this.response.postResponse(data.id);
    } catch (error) {
      throw new InternalServerErrorException("something wrong : ", error);
    }
  }

  async getSinglePayment(id: number) {
    const payment = await Payment.findOne({
      relations: {
        booking: true,
      },
      where: { status: Not(8), id: id },
    });
    if (!payment) throw new BadRequestException(`This payment ${id} not found`);
    return payment;
  }
  async getAllPayment(id: number) {
    return Payment.query(`SELECT
    p.*
  FROM
    payment p
    INNER JOIN booking b ON p. "bookingId" = b.id
    INNER JOIN boat bo ON b. "boatId" = bo.id
    INNER JOIN "users" u ON bo. "userId" = u.id
  WHERE
    p.status <> ${8}
    AND u.id = ${id};`);
  }

  async deletePayment(id: number) {
    const payment = await Payment.findOne({
      relations: {
        booking: true,
      },
      where: { status: Not(8), id: id },
    });
    if (!payment) throw new BadRequestException(`This payment ${id} not found`);
    try {
      payment.status = 8;
      payment.updated_by = 1;
      await Payment.update(id, payment);
      return this.response.deleteResponse(id);
    } catch (error) {
      throw new InternalServerErrorException("something wrong : ", error);
    }
  }
  async paymemtUpdateStatus(iniPaymentRef: number, status: string) {
    const payment = await Payment.findOne({
      relations: {
        booking: true,
      },
      where: { status: Not(8), iniPaymentRef },
    });
    if (!payment)
      throw new BadRequestException(`This payment ${iniPaymentRef} not found`);

    try {
      payment.paymentStatus = status;
      await Payment.update(payment.id, payment);
      return this.response.updateResponse(payment.id);
    } catch (error) {
      throw new InternalServerErrorException("something wrong : ", error);
    }
  }

  async createPayments() {
    // Fetch the booking records
    const bookings = await Booking.find();

    // Generate payment records for each booking
    const payments: Payment[] = [];
    for (const booking of bookings) {
      const payment = new Payment();
      payment.amount = Math.floor(Math.random() * 90000) + 10000; // Generate random amount (between 10000 and 99999)
      payment.paymentStatus = this.generateRandomPaymentStatus(); // Generate random payment status
      payment.iniPaymentRef = Math.floor(Math.random() * 1000000) + 1; // Generate random iniPaymentRef
      payment.extPaymentRef = Math.floor(Math.random() * 1000000) + 1; // Generate random extPaymentRef
      payment.status = 1;
      payment.accountNumber = this.generateRandomAccountNumber(); // Generate random account number
      payment.created_by = 1;
      payment.updated_by = 1;

      // Set created_at to a random past date or today's date
      const isToday = Math.random() < 0.5; // 50% chance for today's date
      if (isToday) {
        payment.created_at = new Date(); // Set created_at to today's date
      } else {
        payment.created_at = this.generateRandomPastDate(); // Set created_at to a random past date
      }

      payment.updated_at = new Date(); // Set updated_at to current date
      payment.booking = booking;
      payment.user = null;
      await payment.save();
    }
  }

  private generateRandomPaymentStatus(): string {
    const statuses = ["pending", "approved", "rejected"];
    const randomIndex = Math.floor(Math.random() * statuses.length);
    return statuses[randomIndex];
  }

  private generateRandomAccountNumber(): string {
    const accountNumber = Math.floor(Math.random() * 100000000)
      .toString()
      .padStart(8, "0");
    return accountNumber;
  }

  private generateRandomPastDate(): Date {
    const startDate = new Date(2020, 5, 20); // June 20, 2020
    const endDate = new Date(); // Current date
    const randomTimestamp =
      Math.random() * (endDate.getTime() - startDate.getTime()) +
      startDate.getTime();
    return new Date(randomTimestamp);
  }
}
