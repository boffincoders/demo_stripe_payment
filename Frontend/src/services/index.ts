import axios from "axios";
let baseUrl = "http://localhost:5000/";
class StripeServices {
  makePayment = (data: { user: string; amount: number; tokenId: string }) => {
    return axios
      .post(`${baseUrl}make-payment`, data)
      .then((res) => res.data)
      .catch((err) => err);
  };
  confirmPayment = (payload: { paymentId: string; tokenId: string }) => {
    return axios
      .post(`${baseUrl}confirm-payment`, payload)
      .then((res) => res.data)
      .catch((err) => err);
  };
  cancelPayment = (paymentId: string) => {
    return axios
      .post(`${baseUrl}cancel-payment`, { paymentId })
      .then((res) => res.data)
      .catch((err) => err);
  };
  getPayments = () => {
    return axios
      .get(`${baseUrl}payments`)
      .then((res) => res.data)
      .catch((err) => err);
  };
}

// eslint-disable-next-line import/no-anonymous-default-export
export default new StripeServices();
