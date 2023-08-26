import {
  BadRequestException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { Not } from "typeorm";
import e from "express";
@Injectable()
export class ReferencesService {
  constructor() {}

  async generateInternalRefId() {
    var ref = "";

    while (ref.length < 6) {
      var randomNumber = Math.floor(Math.random() * 10);

      if (ref.indexOf(randomNumber.toString()) === -1) {
        ref += randomNumber.toString();
      }
    }
    return ref;
  }
  async generateExternalRefId() {
    var ref = "";

    while (ref.length < 6) {
      var randomNumber = Math.floor(Math.random() * 10);

      if (ref.indexOf(randomNumber.toString()) === -1) {
        ref += randomNumber.toString();
      }
    }
    return ref;
  }
}
