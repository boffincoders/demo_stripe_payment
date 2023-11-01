import { BrowserRouter, Route, Routes } from "react-router-dom";
import StripePayment from "./components/stripePayment";
import PaymentDetails from "./components/stripePayment/paymentDetails";


function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<StripePayment />} />
        <Route path="/payment-details" element={<PaymentDetails />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
