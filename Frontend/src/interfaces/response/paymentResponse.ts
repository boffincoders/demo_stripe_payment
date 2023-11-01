export interface IPaymentResponse {
  id: string;
  object: string;
  card: Card;
  client_ip: string;
  created: number;
  livemode: boolean;
  type: string;
  used: boolean;
}

export interface Card {
  id: string;
  object: string;
  address_city?: any;
  address_country?: any;
  address_line1?: any;
  address_line1_check?: any;
  address_line2?: any;
  address_state?: any;
  address_zip: string;
  address_zip_check: string;
  brand: string;
  country: string;
  cvc_check: string;
  dynamic_last4?: any;
  exp_month: number;
  exp_year: number;
  funding: string;
  last4: string;
  name?: any;
  tokenization_method?: any;
  wallet?: any;
}
