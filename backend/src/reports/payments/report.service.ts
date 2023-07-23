import {
  BadRequestException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { Not } from "typeorm";
import { createCanvas, loadImage, registerFont } from "canvas";
import { Booking } from "../../booking/entity/booking.entity";
import { AuthService } from "../../auth/auth.service";
import { JwtService } from "@nestjs/jwt";
import { Payment } from "../../payment/entity/payment.entity";

export type Usa = any;
@Injectable()
export class PaymentReportService {
  constructor() {}
  async countBookingsBySkipper(id: number) {
    return Payment.count({
      where: { status: Not(8), booking: { boat: { user: { id } } } },
    });
  }
  async countTotalAmoutPayments(id: number) {
    return Payment.query(`SELECT COALESCE(SUM(p.amount), 0) AS total_amount
    FROM payment p
    INNER JOIN booking b ON p."bookingId" = b.id
    INNER JOIN boat bo ON b."boatId" = bo.id
    INNER JOIN "users" u ON bo."userId" = u.id
    WHERE 
    p.status <> ${8}
    AND u.id = ${id}
      AND p."paymentStatus" = 'approved';
    `);
  }

  async dailyAverageIncome(id: number) {
    return Payment.query(`SELECT AVG(daily_totals.total_amount) AS average_total_amount
    FROM (
      SELECT DATE_TRUNC('day', p.created_at) AS payment_date, SUM(p.amount) AS total_amount
      FROM payment p
      INNER JOIN booking b ON p."bookingId" = b.id
      INNER JOIN boat bo ON b."boatId" = bo.id
      INNER JOIN "users" u ON bo."userId" = u.id
      WHERE
      p.status <> ${8}
      AND u.id = ${id}
        AND p."paymentStatus" = 'approved'
      GROUP BY payment_date
    ) AS daily_totals
  `);
  }
  async calculateTodayIncome(id: number) {
    const amount =
      await Payment.query(`SELECT COALESCE(SUM(p.amount), 0) AS total_amount
    FROM payment p
    INNER JOIN booking b ON p."bookingId" = b.id
    INNER JOIN boat bo ON b."boatId" = bo.id
    INNER JOIN "users" u ON bo."userId" = u.id
    WHERE 
    p.status <> ${8}
    AND u.id = ${id}
      AND p."paymentStatus" = 'approved'
      AND DATE_TRUNC('day', p.created_at) = CURRENT_DATE;
    
  `);
    return amount[0].total_amount;
  }
  async getTodaysPercentage(id: number) {
    const todayAmount = await this.calculateTodayIncome(id);
    const dailyAmount = await this.dailyAverageIncome(id);

    const total = todayAmount / dailyAmount[0].average_total_amount;

    const result = total * 100;
    return total;
  }

  async totalAmountEarnedLast6Months(id: number) {
    //

    const result = await Payment.query(`
SELECT
TO_CHAR(months.month, 'Month') AS name,
COALESCE(SUM(p.amount), 0) AS Total
FROM (
SELECT
  DATE_TRUNC('month', CURRENT_DATE - INTERVAL '5 months') + INTERVAL '1 month' * s.a AS month
FROM
  generate_series(0, 5) AS s (a)) AS months
LEFT JOIN (
  SELECT
    p.amount,
    DATE_TRUNC('month', p.created_at) AS month
  FROM
    payment p
    INNER JOIN booking b ON p. "bookingId" = b.id
    INNER JOIN boat bo ON b. "boatId" = bo.id
    INNER JOIN "users" u ON bo. "userId" = u.id
  WHERE
    p.status <> ${8}
    AND u.id = ${id}
    AND p. "paymentStatus" = 'approved'
    AND DATE_TRUNC('year', p.created_at) = DATE_TRUNC('year', CURRENT_DATE)
    AND DATE_TRUNC('month', p.created_at) >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '5 months')) AS p ON DATE_TRUNC('month', p.month) = months.month
GROUP BY
months.month
ORDER BY
months.month;
`);

    const formattedResult = result.map((row: any) => ({
      name: row.name,
      total: row.total,
    }));

    return formattedResult;
  }

  async generateImageWithQuote(quote: string): Promise<Buffer> {
    const canvas = createCanvas(800, 600);
    const ctx = canvas.getContext("2d");

    // Load the desired font
    registerFont("/absolute/path/to/your/font.ttf", {
      family: "YourFontFamily",
    });
    registerFont("src/fonts/your-font-file.ttf", { family: "YourFontFamily" });

    // Set canvas dimensions
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    // Set text properties
    const fontSize = 30;
    const fontFamily = "YourFontFamily";
    const textColor = "#000000";

    // Measure text size
    ctx.font = `${fontSize}px ${fontFamily}`;
    const textMetrics = ctx.measureText(quote);
    const textWidth = textMetrics.width;
    const textHeight =
      textMetrics.actualBoundingBoxAscent +
      textMetrics.actualBoundingBoxDescent;

    // Calculate text position for centering
    const textX = (canvasWidth - textWidth) / 2;
    const textY = (canvasHeight - textHeight) / 2;

    // Clear canvas
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Draw text
    ctx.fillStyle = textColor;
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.font = `${fontSize}px ${fontFamily}`;
    ctx.fillText(quote, textX, textY);

    // Return the image buffer
    return canvas.toBuffer();
  }
}
