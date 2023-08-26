import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { UserService } from "../user/user/user.service";
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector, private userService: UserService) {}

  matchRoles(roles: string[], userRole: string) {
    return roles.some((role) => role === userRole);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<string[]>("roles", context.getHandler());
    const request = context.switchToHttp().getRequest();

    if (request?.user) {
      const { id } = request.user;
      const user = await this.userService.findUserByPhone(
        request.user.username,
      );
      return roles.includes(user.access_level);
    }
    return false;
  }
}
