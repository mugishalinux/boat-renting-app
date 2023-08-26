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
import { Rank } from "./entity/rank.entity";
import { User } from "../user/user/entity/user.entity";
import { Location } from "../location/entity/location.entity";
import { Boat } from "../boats/entity/boat.entity";
export type Usa = any;
@Injectable()
export class RankService {
  constructor(private response: ResponseService) {}
  async addRank(boat: Boat) {
    const rank = new Rank();
    rank.boat = boat;
    rank.ranks = 0;
    rank.status = 1;
    rank.created_by = 1;
    rank.updated_by = 1;
    try {
      const datas = await rank.save();
      return this.response.postResponse(datas.id);
    } catch (error) {
      throw new InternalServerErrorException("something wrong : ", error);
    }
  }
  async incrementRank(rankId: number) {
    const rank = await Rank.findOne({
      where: { status: Not(8), id: rankId },
    });
    if (!rank) throw new BadRequestException(`This rank ${rankId} not found`);
    rank.ranks = rank.ranks + 1;
    try {
      const data = await Rank.update(rankId, rank);
      return this.response.updateResponse(rankId);
    } catch (error) {
      throw new InternalServerErrorException("something wrong : ", error);
    }
  }
  async decrementRank(rankId: number) {
    const rank = await Rank.findOne({
      where: { status: Not(8), id: rankId },
    });
    if (!rank) throw new BadRequestException(`This rank ${rankId} not found`);
    if (rank.ranks != 0) {
      rank.ranks = rank.ranks - 1;
    }
    try {
      const data = await Rank.update(rankId, rank);
      return this.response.updateResponse(rankId);
    } catch (error) {
      throw new InternalServerErrorException("something wrong : ", error);
    }
  }
}
