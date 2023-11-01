export interface IPaymentDetailsResponse {
  paymentStartedAt: string;
  paymentDetails: PaymentDetails;
}

export interface PaymentDetails {
  status: string;
  amount: number;
  description: string;
  paymentMethod?: any;
  paymentId: string;
  reason?: string;
}
