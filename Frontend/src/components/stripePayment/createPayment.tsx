import { useNavigate } from "react-router-dom";

const CreatePayment = ({
    setIsPayment,
}: {
    setIsPayment: (values: boolean) => void;
}) => {
    const navigate = useNavigate()
    return (
        <div className="flex items-center justify-center h-screen">
            <div className="flex gap-4">
                <button
                    onClick={() => setIsPayment(true)}
                    className="bg-blue-500 p-3 rounded-3xl text-white"
                >
                    Stripe Demo Payment
                </button>
                <button
                    onClick={() => navigate("/payment-details")}
                    className="bg-blue-500 p-3 rounded-3xl text-white"
                >
                    My Payment Details
                </button>
            </div>
        </div>
    );
};

export default CreatePayment;
