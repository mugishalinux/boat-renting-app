import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "../user/user/user.service";
import * as bcrypt from "bcrypt";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(phone: string, passwords: string): Promise<any> {
    const user = await this.usersService.findUserByPhone(phone);
    if (!user) return null;
    if (user.status == 2) {
      throw new UnauthorizedException(
        "Account Not yet Activated! contact admin",
      );
    }
    const isPasswordValid = await bcrypt.compare(passwords, user.password);
    if (!isPasswordValid) return null;
    const {
      password,
      updated_at,
      updated_by,
      status,
      created_at,
      created_by,
      ...result
    } = user;
    return result;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
