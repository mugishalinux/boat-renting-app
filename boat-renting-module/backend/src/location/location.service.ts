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
import { Location } from "./entity/location.entity";
import { LocationUpateDto } from "./update.dto";
import { LocationRegisterDto } from "./register.location";
export type Usa = any;
@Injectable()
export class LocationService {
  constructor(private response: ResponseService) {}

  async createLocation(data: LocationRegisterDto, id: number) {
    const location = new Location();
    location.locationName = data.locationName;
    location.locationImage = data.locationImage;
    location.status = 1;
    location.created_by = id;
    location.updated_by = id;
    try {
      const data = await location.save();
      return this.response.postResponse(data.id);
    } catch (error) {
      throw new InternalServerErrorException("something wrong : ", error);
    }
  }
  async updateLocation(id: number, data: LocationUpateDto, userId: number) {
    const location = await Location.findOne({
      where: { id },
    });
    if (!location)
      throw new BadRequestException(`This location ${id} not found`);
    location.locationName = data.locationName;
    location.locationImage = data.locationImage;
    location.updated_by = userId;
    try {
      const data = await Location.update(id, location);
      return this.response.updateResponse(id);
    } catch (error) {
      throw new InternalServerErrorException("something wrong : ", error);
    }
  }
  async getAllLocations() {
    return Location.find({ where: { status: Not(8) } });
  }
  async getSingleLocation(id: number) {
    const location = await Location.findOne({
      where: { status: Not(8), id: id },
    });
    if (!location)
      throw new BadRequestException(`This location ${id} not found`);
    return location;
  }
  async deleteLocation(id: number, userId: number) {
    const location = await Location.findOne({
      where: { id },
    });
    if (!location)
      throw new BadRequestException(`This location ${id} not found`);
    try {
      location.status = 8;
      location.updated_by = userId;
      await Location.update(id, location);
      return this.response.deleteResponse(id);
    } catch (error) {
      throw new InternalServerErrorException("something wrong : ", error);
    }
  }
}
