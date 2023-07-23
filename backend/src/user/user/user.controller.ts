import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Request,
  Post,
  Put,
  Query,
  UnauthorizedException,
  UseGuards,
  HttpException,
  HttpStatus,
  ConsoleLogger,
  ForbiddenException,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { LoginDto } from "./dto/login.dto";
import { UserDto } from "./dto/userDto";
import { User } from "./entity/user.entity";
import { UserService } from "./user.service";
import { ApiBearerAuth, ApiQuery, ApiTags } from "@nestjs/swagger";
import { LocalAuthGuard } from "../../auth/local-auth.guard";
import { AuthService } from "../../auth/auth.service";
import { Not } from "typeorm";
import { JwtService } from "@nestjs/jwt";
import { JwtAuthGuard } from "../../auth/jwt-auth.guard";
import { ResetPassword } from "./dto/reset-password.dto";
import { HasRoles } from "../../auth/has-roles.decorator";
import { RolesGuard } from "../../auth/roles.guard";
import { Role } from "./enums/role";
import { FilterHelper } from "../../helpers/filter.helper";
import { SubscriberDto } from "./dto/subscriber.dto";
import { RegisterDto } from "./dto/register.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { ForgetPasswordDto } from "./dto/forget.password";
import { ClientDto } from "./dto/client.dto";

@Controller("user")
@ApiTags("user")
export class UserController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
    private filter: FilterHelper,
    private jwtService: JwtService,
  ) {}

  @Post("createSkipper")
  @ApiBearerAuth()
  async createSkipper(@Body() userDto: RegisterDto) {
    userDto.access_level = "skipper";
    return this.userService.createUsers(userDto);
  }
  @Post("createAdmin")
  @ApiBearerAuth()
  async createAdmin(@Body() userDto: RegisterDto) {
    userDto.access_level = "admin";
    console.log(userDto)
    // return this.userService.createUsers(userDto);
  }

  @Post("createClient")
  @ApiBearerAuth()
  async createClient(@Body() userDto: ClientDto) {
    return this.userService.createClient(userDto);
  }

  @HasRoles("admin")
  @UseGuards(JwtAuthGuard)
  @Put("updateUserInfo/:id")
  @ApiBearerAuth()
  async updateUserInfo(
    @Param("id") id: number,
    @Body() userDto: UpdateUserDto,
  ) {
    return this.userService.upadateUserInfo(id, userDto);
  }

  @ApiBearerAuth()
  @HasRoles("admin")
  @UseGuards(JwtAuthGuard)
  @Put("activateSkipperAccount/:id")
  @ApiBearerAuth()
  async activateSkipperAccount(@Request() req, @Param("id") id: number) {
    const user = await User.findOne({
      where: { id: req.user.userId },
    });
    if (user.access_level == "skipper") {
      throw new ForbiddenException("You are not allowed activate account");
    }
    return this.userService.approveSkipperAccount(id);
  }
  @ApiBearerAuth()
  @HasRoles("admin")
  @UseGuards(JwtAuthGuard)
  @Put("disableSkipperAccount/:id")
  @ApiBearerAuth()
  async disableSkipperAccount(@Request() req, @Param("id") id: number) {
    const user = await User.findOne({
      where: { id: req.user.userId },
    });
    if (user.access_level == "skipper") {
      throw new ForbiddenException("You are not allowed activate account");
    }
    return this.userService.disableSkipperAccount(id);
  }

  @Post("updatingPassword/id/:id/password/:password")
  @ApiBearerAuth()
  async updatePassword(
    @Param("id") id: number,
    @Param("password") password: string,
  ) {
    return this.userService.updatingPassword(id, password);
  }

  @ApiBearerAuth()
  @HasRoles("admin")
  @UseGuards(JwtAuthGuard)
  @ApiQuery({ required: false, name: "pageNumber" })
  @ApiQuery({ required: false, name: "pageSize" })
  @ApiQuery({ required: false, name: "email" })
  @ApiQuery({ required: false, name: "search" })
  @Get("/getAllSkipper")
  async getAllSkipper(
    @Request() req,
    @Query("pageNumber") pageNumber: number,
    @Query("email") email: string,
    @Query("pageSize") pageSize: number,
  ) {
    // Returned filters can be passed to a Typeorm entity as House.find({where: filter})
    const user = await this.filter.paginate(
      User,
      pageSize || 10,
      pageNumber || 1,
      {
        // ...filter,
        status: Not(8),
        access_level: Not("admin"),
      },
    );
    return user;
  }

  @ApiBearerAuth()
  @HasRoles("admin")
  @UseGuards(JwtAuthGuard)
  @ApiQuery({ required: false, name: "pageNumber" })
  @ApiQuery({ required: false, name: "pageSize" })
  @ApiQuery({ required: false, name: "email" })
  @ApiQuery({ required: false, name: "search" })
  @Get("/getAllAdmins")
  async getAllAdmins(
    @Request() req,
    @Query("pageNumber") pageNumber: number,
    @Query("email") email: string,
    @Query("pageSize") pageSize: number,
  ) {
    // Returned filters can be passed to a Typeorm entity as House.find({where: filter})
    const user = await this.filter.paginate(
      User,
      pageSize || 10,
      pageNumber || 1,
      {
        // ...filter,
        status: Not(8),
        access_level: Not("skipper"),
      },
    );
    return user;
  }

  @ApiBearerAuth()
  @HasRoles("admin")
  @UseGuards(JwtAuthGuard)
  @Get(":id")
  getSingleUserById(@Param("id") id: number): Promise<User> {
    return this.userService.getSingleUser(id);
  }

  @ApiBearerAuth()
  @HasRoles("admin")
  @UseGuards(JwtAuthGuard)
  @Get("all/:role")
  getAllUserByAccessLevel(@Param("role") role: string) {
    return this.userService.getAllUsersByAccessLevel(role);
  }

  @ApiBearerAuth()
  @HasRoles("admin")
  @UseGuards(JwtAuthGuard)
  @Get("")
  getAllUser() {
    return this.userService.getAllUsers();
  }

  @ApiBearerAuth()
  @HasRoles("admin")
  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  deleteUser(@Param("id") id: number) {
    return this.userService.deleteUser(id);
  }
  @Post("forget/password")
  @ApiBearerAuth()
  async forgetPassword(@Body() userData: ForgetPasswordDto) {
    return this.userService.forgetPassword(userData);
  }

  @ApiBearerAuth()
  @Post("auth/login/user")
  async login(@Body() loginDto: LoginDto) {
 
    const user = await this.authService.validateUser(
      loginDto.phone,
      loginDto.password,
    );
    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const data = await User.findOne({ where: { id: user.id } });
    const payload = { id: user.id, names: user.names };
    const jwtToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET,
    });
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: user.id,
          names: user.names,
          phone: user.primaryPhone,
          access_level: user.access_level,
          profile: user.profilePicture,
          jwtToken,
        });
      }, 2000); // Delay the response by 3 seconds
    });
  }
}
