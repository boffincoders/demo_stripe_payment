import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { StripeCardElementChangeEvent } from "@stripe/stripe-js";
import { Button, InputNumber, message } from "antd";
import confirm from "antd/es/modal/confirm";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import StripeServices from "../../services/index";
const PaymentForm = ({
    setIsPayment,
    setAmount,
    amount,
    setIsInternetConnection
}: {
    setIsPayment: (values: boolean) => void;
    setIsInternetConnection: (values: boolean) => void;
    setAmount: (values: number) => void;
    amount: number | undefined;
}) => {
    const elements: any = useElements();
    const [loader, setLoader] = useState<boolean>(false);
    const [paymentModalOpen, setIsPaymentModalOpen] = useState<boolean>(false)
    const stripe = useStripe();
    const navigate = useNavigate();
    const [cardDetails, setCardDetails] =
        useState<StripeCardElementChangeEvent>();
    const handlePayment = async (details: StripeCardElementChangeEvent) => {
        setLoader(true);
        const cardElement: any = await elements.getElement(CardElement);
        if (stripe) {
            const { token } = await stripe.createToken(cardElement);
            if (token && amount) {
                let paymentMethodId = await stripe.createPaymentMethod({
                    type: "card",
                    card: {
                        token: token?.id,
                    },
                });
                let response = await StripeServices.makePayment({
                    amount: amount,
                    user: "test user",
                    tokenId: paymentMethodId.paymentMethod?.id ?? "",
                });
                if (response.success) {
                    confirm({
                        type: "confirm",
                        title: "Payment started. Do you want to confirm the payment ?",
                        onOk: async () => {
                            setIsPaymentModalOpen(true)

                            await handleConfirmPayment({
                                paymentId: response?.paymentDetails?.id,
                                tokenId: paymentMethodId.paymentMethod?.id ?? "",
                            })
                        },
                        okType: "primary",
                        onCancel: async () => cancelPayment(response?.paymentDetails?.id),
                    });
                }
            }
        }
        else message.error("Something went wrong. Please check your internet connection")
        setLoader(false);
    };
    const cancelPayment = async (id: string) => {
        try {
            let response = await StripeServices.cancelPayment(id);
            if (response.success) {
                message.success("Payment cancelled success");

                navigate("/payment-details");
            }
        } catch (error) {
            message.error("Something went wrong");
        }

        setIsPayment(false);
    };
    const handleConfirmPayment = async (payload: {
        paymentId: string;
        tokenId: string;
    }) => {
        try {
            let response = await StripeServices.confirmPayment(payload);
            if (response.success) {
                message.success("Payment success");
                navigate("/payment-details");
            }

        } catch (error) {
            message.error("Something went wrong");
        }
        setIsPayment(false);
    };
    useEffect(() => {
        if (paymentModalOpen) setTimeout(() => {
            setIsInternetConnection(false)
            setIsPayment(false)
        }, 20000)

    }, [paymentModalOpen])
    return (
        <>
            <div className="flex justify-center items-center my-6">
                <div className=" w-full max-lg:px-4 md:w-[60%] lg:w-[50%] xl:w-[40%]">
                    <p className="text-sm font-medium mb-1">Amount</p>
                    <div className="mb-4">
                        <InputNumber
                            placeholder="Enter amount to pay"
                            value={amount}
                            onChange={(e) => setAmount(Number(e))}
                            type="number"
                            size="large"
                            style={{ borderRadius: "0" }}
                            className=" w-full"
                        />
                        {amount ? amount > 10000 && (
                            <p className="text-xs font-medium mt-1 text-center text-red-600">
                                Amount not be greater than 10000
                            </p>
                        ) : <></>}
                    </div>
                    <p className="text-sm font-medium mb-1">Card Details</p>

                    <form>
                        <CardElement
                            onChange={(e) => {
                                setCardDetails(e);
                            }}
                        />
                        <div className="flex justify-center items-center">
                            <Button
                                loading={loader}
                                type="primary"
                                onClick={(e) => {
                                    e.preventDefault();
                                    cardDetails && handlePayment(cardDetails);
                                }}
                                disabled={!cardDetails?.complete || !amount || amount > 10000}
                                className="mt-6 text-white bg-blue-300 p-2 px-6 rounded-3xl h-10"
                            >
                                Make Payment
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default PaymentForm;
