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
  Req,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { AuthGuard } from "@nestjs/passport";
import { ApiBearerAuth, ApiQuery, ApiTags } from "@nestjs/swagger";
import { FilterHelper } from "../../helpers/filter.helper";
import { Not } from "typeorm";
import { PaymentService } from "../payment.service/payment.service";
import { AuthService } from "../../auth/auth.service";
import { JwtAuthGuard } from "../../auth/jwt-auth.guard";
import { RolesGuard } from "../../auth/roles.guard";
import { HasRoles } from "../../auth/has-roles.decorator";
import { PaymentDto } from "../dto/payment.dto";
import { Payment } from "../entity/payment.entity";
import Stripe from "stripe";
import "stripe";
import { PaymentPostDto } from "../dto/payment.post.dto";

const stripe = new Stripe("YOUR_STRIPE_SECRET_KEY", {
  apiVersion: "2020-08-27",
});

@Controller("payment")
@ApiTags("payment")
export class PaymentController {
  constructor(
    private paymentService: PaymentService,
    private authService: AuthService,
    private filter: FilterHelper,
    private jwtService: JwtService,
  ) {}
  @Post("creation")
  @ApiBearerAuth()
  async inititatePayment(@Body() data: PaymentDto, @Request() req) {
    return this.paymentService.initiatePayment(data);
  }

  @ApiQuery({ required: false, name: "pageNumber" })
  @ApiQuery({ required: false, name: "pageSize" })
  @ApiQuery({ required: false, name: "search" })
  @HasRoles("skipper", "admin", "user")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get("/all")
  @ApiBearerAuth()
  async getAllBookings(
    @Request() req,
    @Query("pageNumber") pageNumber: number,
    @Query("pageSize") pageSize: number,
  ) {
    // Returned filters can be passed to a Typeorm entity as House.find({where: filter})
    const payment = await this.filter.paginate(
      Payment,
      pageSize || 10,
      pageNumber || 1,
      {
        status: Not(8),
        booking: { boat: { user: { id: req.user.userId } } },
      },
      ["booking"],
    );
    return payment;
  }

  @ApiQuery({ required: false, name: "pageNumber" })
  @ApiQuery({ required: false, name: "pageSize" })
  @ApiQuery({ required: false, name: "search" })
  @HasRoles("skipper", "admin", "user")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get("/all/payment/user")
  @ApiBearerAuth()
  async getAllPaymentOfUser(
    @Request() req,
    @Query("pageNumber") pageNumber: number,
    @Query("pageSize") pageSize: number,
  ) {
    // Returned filters can be passed to a Typeorm entity as House.find({where: filter})
    const payment = await this.filter.paginate(
      Payment,
      pageSize || 10,
      pageNumber || 1,
      {
        status: Not(8),
        user: { id: req.user.userId },
      },
      ["booking"],
    );
    return payment;
  }
  @ApiBearerAuth()
  @Put("update/:id/status/:status")
  updatePaymentStatus(
    @Param("id") id: number,
    @Param("status") status: string,
    @Request() req,
  ) {
    console.log();
    return this.paymentService.paymemtUpdateStatus(id, status);
  }

  @ApiBearerAuth()
  @HasRoles("skipper", "admin", "user")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(":id")
  getSinglePayment(@Param("id") id: number, @Request() req) {
    console.log();
    return this.paymentService.getSinglePayment(id);
  }

  @ApiBearerAuth()
  @HasRoles("skipper", "admin", "user")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(":id")
  deletePayment(@Param("id") id: number, @Request() req) {
    return this.paymentService.deletePayment(id);
  }
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get("")
  getAllPaymentList(@Request() req) {
    return this.paymentService.getAllPayment(req.user.userId);
  }
  @ApiBearerAuth()
  @Post("/create")
  async createPayments(): Promise<void> {
    await this.paymentService.createPayments();
  }

  @ApiBearerAuth()
  @Post("makePayment")
  async makePayment(
    @Body() paymentData: PaymentPostDto,
    @Req() req: Request,
  ): Promise<PaymentResultDto> {
    try {
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
        apiVersion: "2022-11-15",
      });

      // Replace this with your actual payment logic
      // Here, we are simulating a successful payment with static data
      const paymentIntent = await stripe.paymentIntents.create({
        amount: paymentData.amount,
        currency: paymentData.currency,
        description: "Sample Payment",
        payment_method_types: ["card"],
        // payment_method: paymentData.paymentMethodId, // Provide the payment method ID here
        confirm: true,
      });

      if (paymentIntent.status === "succeeded") {
        // Payment successful
        return {
          success: true,
          message: "Payment successful!",
          paymentId: paymentIntent.id,
        };
      } else {
        // Payment failed
        return {
          success: false,
          message: "Payment failed!",
          paymentId: paymentIntent.id,
        };
      }
    } catch (error) {
      // Handle any errors that occurred during payment
      console.log(error);
      return {
        success: false,
        message: "An error occurred during payment!",
        paymentId: null,
      };
    }
  }
}
