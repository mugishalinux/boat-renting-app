import { ExtractJwt, Strategy } from 'passport-jwt';
import * as dotenv from "dotenv";
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
dotenv.config();
require("dotenv").config();

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    return { userId: payload.id, username: payload.primaryPhone };
  }
}