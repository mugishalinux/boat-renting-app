import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from "@nestjs/common";
import { AppService } from "./app.service";
import axios from "axios";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

@Controller("test")
@ApiTags("test")
export class AppController {
  constructor(private readonly appService: AppService) {}
  @Post()
  @ApiBearerAuth()
  test(){
    return this.appService.test()
  }
}
