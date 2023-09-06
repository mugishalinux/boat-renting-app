export class BookingReportDto {
  
  id: number;

  bookingRef: number;

  bookingDate: string;

  bookingFrom: string;

  bookingTo: string;

  status: number;

  names: string;

  phoneNumber: string;

  created_at: Date;

  paymentStatus: string;

  skipperNames: string;
  
  skipperNumber: string;
}
