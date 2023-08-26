import { Injectable, Param } from "@nestjs/common";
import { Controller, Get, Post } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { Observable } from "rxjs";
import axios from "axios";
import circular from "circular-json";

@Injectable()
export class AppService {
  constructor(private readonly httpService: HttpService) {}
  async test() {
    const url = "https://www.intouchsms.co.rw/api/sendsms/.json";
    const bodyData = {
      recipients: "0783381277",
      message: "template",
      sender: "0788208693",
    };
    const config = {
      auth: {
        username: process.env.SMSUSERNAME,
        password: process.env.SMSPASSWORD,
      },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };

    try {
      const response = await axios.post(url, bodyData, config);
      console.log(response);
    } catch (error) {
      console.error(error.message);
    }
    return "hello";
  }
}
