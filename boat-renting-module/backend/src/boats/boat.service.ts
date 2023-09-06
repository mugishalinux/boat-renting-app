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
import { LocationUpateDto } from "./update.dto";
import { LocationRegisterDto } from "./register.location";
import { RegistrationBoatDto } from "./dto/registratio.boat";
import { Boat } from "./entity/boat.entity";
import { User } from "../user/user/entity/user.entity";
import { Location } from "../location/entity/location.entity";
import { BoatImages } from "./entity/boat.photo";
import { RankService } from "../rank/rank.service";
export type Usa = any;
@Injectable()
export class BoatService {
  constructor(
    private response: ResponseService,
    private rankService: RankService,
  ) {}

  async createNewBoat(data: RegistrationBoatDto) {
    const user = await User.findOne({
      where: { status: Not(8), id: data.user },
    });
    if (!user)
      throw new BadRequestException(`User with ID ${data.user} not found`);

    const location = await Location.findOne({
      where: { id: data.location },
    });
    if (!location)
      throw new BadRequestException(`This location ${data.location} not found`);
    const boat = new Boat();
    boat.location = location;
    boat.user = user;
    boat.price = data.price;
    boat.maxNumber = data.maxNumber;
    boat.created_by = user.id;
    boat.updated_by = user.id;
    boat.status = 1;
    boat.boatImages = data.boatImages;
    const count = await Boat.count();

    // Increment the count by 1 and format it with leading zeros
    const serialNumber = String(count + 1).padStart(7, "0");
    boat.serialNumber=serialNumber;
    try {
      const datas = await boat.save();
      await this.rankService.addRank(boat);
      return this.response.postResponse(datas.id);
    } catch (error) {
      console.log(error);
      throw new BadRequestException("something wrong : ", error);
    }
  }
  async updateBoatInfo(id: number, data: RegistrationBoatDto, userId: number) {
    const price = parseInt(data.price, 10);
    const maxNumber = parseInt(data.maxNumber, 10);

    //checking if boat exist
    const boat = await Boat.findOne({
      where: { status: Not(8), id: id },
    });
    if (!boat) throw new BadRequestException(`This boat ${id} not found`);

    //checking if user exist
    const user = await User.findOne({
      where: { status: Not(8), id: data.user },
    });
    if (!user)
      throw new BadRequestException(`User with ID ${data.user} not found`);

    //checking if location exist
    const location = await Location.findOne({
      where: { id: data.location },
    });
    if (!location)
      throw new BadRequestException(`This location ${data.location} not found`);

    boat.location = location;
    boat.user = user;
    boat.price = price;
    boat.maxNumber = maxNumber;
    boat.updated_by = user.id;
    boat.boatImages = data.boatImages;
    try {
      const data = await Boat.update(id, boat);

      return this.response.updateResponse(id);
    } catch (error) {
      throw new InternalServerErrorException("something wrong : ", error);
    }
  }

  async getSingleBoat(id: number) {
    const boat = await Boat.findOne({
      relations: {
        user: true,
        location: true,
        rank: true,
      },
      where: { status: Not(8), id: id },
    });
    if (!boat) throw new BadRequestException(`This boat ${id} not found`);
    return boat;
  }

  async getAllBoat(id: number) {
    return Boat.find({
      relations: {
        user: true,
        location: true,
        rank: true,
      },
      where: { status: Not(8), user: { id } },
    });
  }
  async fetchAllBoat(id: number) {
    const location = await Location.findOne({
      where: { id },
    });
    if (!location)
      throw new BadRequestException(`This location ${id} not found`);

    return await Boat.find({
      where: { status: Not(8), location: { id } },
    });
  }

  async deleteBoat(id: number, userId: number) {
    const boat = await Boat.findOne({
      where: { id },
    });
    if (!boat) throw new BadRequestException(`This Boat ${id} not found`);
    try {
      boat.status = 8;
      boat.updated_by = userId;
      await Boat.update(id, boat);
      return this.response.deleteResponse(id);
    } catch (error) {
      throw new InternalServerErrorException("something wrong : ", error);
    }
  }
}
