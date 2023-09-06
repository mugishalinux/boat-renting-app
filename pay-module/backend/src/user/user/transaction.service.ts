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
import axios from "axios";

import e from "express";
import { RegisterDto } from "./dto/register.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { ForgetPasswordDto } from "./dto/forget.password";
import { SupportingDoc } from "./entity/other.doc.entity";
import { ClientDto } from "./dto/client.dto";
import * as dotenv from "dotenv";
dotenv.config();
import * as nodemailer from "nodemailer";
import { Transaction } from "./entity/transcation.entity";
require("dotenv").config();

export type Usa = any;
@Injectable()
export class TransactionService {
  private readonly transporter;
  constructor(private response: ResponseService) {
    this.transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.SMTPUSERNANE,
        pass: process.env.SMTPEMAIL, // Use your Gmail app password here
      },
    });
  }
  async initiatePayment(
    externalRef: number,
    amount: number,
    client: number,
    skipper: number,
  ) {
    const userClient = await User.findOne({
      where: { id: client },
    });
    const userSkipper = await User.findOne({
      where: { id: skipper },
    });
    console.log("user balance : " + userClient.balance);
    console.log("amount : " + amount);
    if (userClient.balance < amount) {
      const paymentStatus = "failed";
      const url = `http://localhost:8000/payment/update/${externalRef}/status/${paymentStatus}`;

      try {
        const response = await axios.put(url);
        // Handle the response here if needed
        console.log(`Payment status updated successfully: ${response.data}`);
        return {
          HttpStatus: 400,
          message: "Insufficient balance",
        };
      } catch (error) {
        // Handle errors here
        console.log(`Error updating payment status: ${error.message}`);
        return {
          HttpStatus: 400,
          message: "Insufficient balance",
        };
      }
    }

    const transactionClient = new Transaction();
    transactionClient.amount = amount;
    transactionClient.externalRef = externalRef;
    transactionClient.transactionType = "debiting";
    transactionClient.user = userClient;
    await transactionClient.save();
    userClient.balance = userClient.balance - amount;
    await User.update(userClient.id, userClient);

    //skipper

    const transactionSkipper = new Transaction();
    transactionSkipper.amount = amount;
    transactionSkipper.externalRef = externalRef;
    transactionSkipper.transactionType = "crediting";
    transactionSkipper.user = userSkipper;
    await transactionSkipper.save();

    userSkipper.balance = Number(userSkipper.balance) + Number(amount);
    await User.update(userSkipper.id, userSkipper);

    try {
      // Send email
      const info1 = await this.transporter.sendMail({
        from: process.env.SMTPUSERNANE,
        to: userClient.email,
        subject: "Payment Confirmed",
        text:
          "\n" +
          "\n" +
          "Dear " +
          userClient.firstName +
          "\n" +
          "You have successfully paid amount " +
          " " + " " +
          amount +
          " for your booking",
      });
      // Send email
      const info2 = await this.transporter.sendMail({
        from: process.env.SMTPUSERNANE,
        to: userSkipper.email,
        subject: "Payment Received",
        text:
          "\n" +
          "\n" +
          "Dear " +
          userSkipper.firstName +
          "\n" +
          "You have successfully received amount from " +
          userClient.firstName +
          " " +
          userClient.lastName +
          " for boat reservation  ",
      });
      console.log("email of skipper " + userSkipper.email)
      console.log("email of skipper " + userClient.email)
      console.log("Email sent:", info1.response);
      console.log("Email sent:", info2.response);
    } catch (error) {
      console.error("Error sending email:", error);
      throw new Error("Email could not be sent");
    }
    const paymentStatus = "approved";
    const url = `http://localhost:8000/payment/update/${externalRef}/status/${paymentStatus}`;

    try {
      const response = await axios.put(url);
      // Handle the response here if needed
      console.log(`Payment status updated successfully: ${response.data}`);
    } catch (error) {
      // Handle errors here
      console.log(`Error updating payment status: ${error.message}`);
    }
    return {
      HttpStatus: 201,
      message: "payment done successfully",
    };
  }
}
