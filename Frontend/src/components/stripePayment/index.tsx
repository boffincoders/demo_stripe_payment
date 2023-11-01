import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useState } from "react";
import NoInternetConnection from "../noInternetConnection";
import CreatePayment from "./createPayment";
import PaymentForm from "./paymentForm";
const stripePromise = loadStripe(
    "pk_test_51NN7mdSCuTYTCni9VLHX5kGG2CFO0jBJZ6uWqL8UGjtjtqIsZvkPOydmEK675jWxaDMaQcD4lBIx3J7Kq2eEVw3000UMLpWY9w"
);
const StripePayment = () => {
    const [isPayment, setIsPayment] = useState<boolean>(false);
    const [amount, setAmount] = useState<number>()
    const [isInternetConnection, setIsInternetConnection] = useState<boolean>(true)
    return (
        <>
            {isInternetConnection ? isInternetConnection && isPayment ? (
                <div>
                    <div className="flex items-center h-screen">
                        <div className="w-full">
                            <h1 className="text-2xl text-center text-blue-500 font-medium font-serif">
                                Stripe Payment
                            </h1>
                            <p className="text-center text-red-500">{"(Please don't enter original card details)"}</p>
                            <Elements stripe={stripePromise}>
                                <PaymentForm setIsInternetConnection={setIsInternetConnection} amount={amount} setAmount={setAmount} setIsPayment={setIsPayment} />
                            </Elements>
                        </div>
                    </div>
                </div>
            ) : (
                isInternetConnection && <CreatePayment setIsPayment={setIsPayment} />
            ) : <NoInternetConnection />}
        </>
    );
};

export default StripePayment;
