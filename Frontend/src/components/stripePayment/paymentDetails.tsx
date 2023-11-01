import { Card } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IPaymentDetailsResponse } from "../../interfaces/response/paymentDetailsResponse";
import StripeServices from "../../services/index";
import Loader from "../loader";
const PaymentDetails = () => {
    const [loader, setLoader] = useState<boolean>(false);
    const navigate = useNavigate();
    const [paymentDetails, setPaymentDetails] = useState<
        IPaymentDetailsResponse[]
    >([]);
    const myPaymentDetails = async () => {
        setLoader(true);
        let response = await StripeServices.getPayments();
        if (response.success) setPaymentDetails(response.paymentDetails);
        setLoader(false);
    };

    useEffect(() => {
        myPaymentDetails();
    }, []);
    return (
        <div>
            {loader ? (
                <Loader />
            ) : (
                <>
                    {paymentDetails && paymentDetails.length > 0 ? (
                        <div className="mt-2">
                            <div className="flex justify-center items-center">
                                <div className="md:w-[80%] lg:w-[70%] xl:w-[60%] w-full">
                                    <div onClick={() => navigate("/")} className="flex justify-between items-center font-medium cursor-pointer">
                                        <h2 className=" text-2xl  ">
                                            Your Payments
                                        </h2>
                                        <p>Go Back</p>
                                    </div>

                                </div>
                            </div>

                            {paymentDetails.map((allPayments) => {
                                return (
                                    <div className="flex justify-center items-center">
                                        <Card
                                            hoverable
                                            className="mt-2 shadow-2xl w-full md:w-[80%] lg:w-[70%] xl:w-[60%]"
                                        >
                                            <h1 className="text-lg tracking-wide">
                                                <span className="font-medium">Amount</span> :{" "}
                                                {`Rs ${allPayments.paymentDetails.amount}`}
                                            </h1>
                                            <p className="mt-1 text-base tracking-wider">
                                                <span className="font-medium">StartedAt</span> :{" "}
                                                {allPayments.paymentStartedAt}
                                            </p>

                                            <p className="mt-1 text-base tracking-wider">
                                                <span className="font-medium">Status</span> :{" "}
                                                {allPayments.paymentDetails.status}
                                            </p>
                                            {allPayments.paymentDetails.reason && (
                                                <p className="mt-1 text-base">
                                                    <span className="tracking-wider font-medium">
                                                        Reason
                                                    </span>{" "}
                                                    : {allPayments.paymentDetails.reason}
                                                </p>
                                            )}
                                        </Card>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="flex h-screen justify-center items-center">
                            <div>
                                <h1 className="text-2xl text-center ">
                                    No Payment Detail Found
                                </h1>
                                <div
                                    onClick={() => navigate("/")}
                                    className="flex justify-center mt-4"
                                >
                                    <button className="bg-blue-500 px-4 text-white rounded-3xl h-10">
                                        Go Back
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default PaymentDetails;
