import cors from "cors";
import express from "express";
import fs from "fs";
import { Stripe } from "stripe";
const app = express();
const port = 5000;
app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use(cors());
export const stripe = new Stripe(
  "sk_test_51NN7mdSCuTYTCni9EFbRQTiw9bfI5aHAg57t4SSAqJGUpVGMawFGsHFXC4XrkHAnXsUmSzuYiJxrp25XejqFiimO00itOh8PzS",
  {
    apiVersion: "2023-10-16",
  }
);
app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.post("/make-payment", async (req, res) => {
  const { amount, tokenId } = req.body;
  let paymentIntent;
  try {
    paymentIntent = await stripe.paymentIntents.create({
      amount: 4000,
      currency: "inr",
      automatic_payment_methods: { enabled: true, allow_redirects: "never" },
      description: "Testing",
    });
  } catch (error) {
    paymentIntent = null;
  }
  let objToWrite: any = {
    paymentStartedAt: new Date(),
    paymentDetails: {
      status: "incompleted",
      amount,
      description: paymentIntent?.description,
      paymentMethod: paymentIntent?.payment_method,
      paymentId: paymentIntent?.id,
      reason: "Payment not initiated",
    },
  };
  if (!paymentIntent) delete objToWrite.paymentDetails.paymentId;

  let readFile = fs.readFileSync("paymentsDetail.txt", "utf-8");
  if (readFile) readFile = JSON.parse(readFile);
  let objToPush = [...readFile, objToWrite];
  fs.writeFileSync("paymentsDetail.txt", JSON.stringify(objToPush));

  return res.json({ success: true, paymentDetails: paymentIntent });
});

app.post("/confirm-payment", async (req, res) => {
  let { paymentId, tokenId } = req.body;
  try {
    let allPaymentsDetail: any[] = JSON.parse(
      fs.readFileSync("paymentsDetail.txt", "utf-8")
    );
    let findIndex = allPaymentsDetail.findIndex(
      (allPaymentData) =>
        allPaymentData?.paymentDetails?.paymentId?.toString() ===
        paymentId?.toString()
    );
    if (findIndex === -1) return res.json({ success: false });

    let confirmPayment = await stripe.paymentIntents.confirm(paymentId, {
      payment_method: tokenId,
      off_session: true,
    });
    if (confirmPayment.status === "succeeded") {
      delete allPaymentsDetail[findIndex].paymentDetails.reason;
      allPaymentsDetail[findIndex] = {
        ...allPaymentsDetail[findIndex],
        paymentDetails: {
          ...allPaymentsDetail[findIndex].paymentDetails,
          status: "succeed",
        },
      };
    } else
      allPaymentsDetail[findIndex] = {
        ...allPaymentsDetail[findIndex],
        paymentDetails: {
          ...allPaymentsDetail[findIndex].paymentDetails,
          reason: "Payment not confirmed",
        },
      };
    fs.writeFileSync("paymentsDetail.txt", JSON.stringify(allPaymentsDetail));
    return res.json({ success: true, paymentDetails: confirmPayment });
  } catch (error) {
    console.log(error);
  }
});
app.post("/cancel-payment", async (req, res) => {
  let { paymentId } = req.body;
  let allPaymentsDetail: any[] = JSON.parse(
    fs.readFileSync("paymentsDetail.txt", "utf-8")
  );
  let findIndex = allPaymentsDetail.findIndex(
    (allPaymentData) =>
      allPaymentData?.paymentDetails?.paymentId?.toString() ===
      paymentId?.toString()
  );

  let cancelPayment = await stripe.paymentIntents.cancel(paymentId);
  if (cancelPayment.status === "canceled")
    allPaymentsDetail[findIndex] = {
      ...allPaymentsDetail[findIndex],
      paymentDetails: {
        ...allPaymentsDetail[findIndex].paymentDetails,
        status: "canceled",
        reason: "Payment canceled",
      },
    };

  fs.writeFileSync("paymentsDetail.txt", JSON.stringify(allPaymentsDetail));

  return res.json({ success: true, paymentDetails: cancelPayment });
});

app.get("/payments", async (req, res) => {
  try {
    let allPaymentsDetail = fs.readFileSync("paymentsDetail.txt", "utf-8");
    if (allPaymentsDetail) allPaymentsDetail = JSON.parse(allPaymentsDetail);
    return res.json({ success: true, paymentDetails: allPaymentsDetail });
  } catch (error) {
    res.json({ success: false, message: "Something went wrong" });
  }
});
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
