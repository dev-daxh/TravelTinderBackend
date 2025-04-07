const Razorpay = require('razorpay');

const razorpayInstance = new Razorpay({
    key_id: "rzp_test_OgBgPiHR93lvSY",
    key_secret: "aBZEpzJsNWtO2R3popvdk1I4"
});

const createOrder = async (req, res) => {
    const options = {
        amount: req.body.amount,
        currency: req.body.currency,
        receipt: "receipt#1",
        payment_capture: 1
    };

    try {
        const response = await razorpayInstance.orders.create(options);
        res.json({
            order_id: response.id,
            currency: response.currency,
            amount: response.amount
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
};

const getPaymentDetails = async (req, res) => {
    const { paymentId } = req.params;

    try {
        const payment = await razorpayInstance.payments.fetch(paymentId);

        if (!payment) {
            return res.status(500).json("Error at Razorpay loading");
        }

        res.json({
            status: payment.status,
            method: payment.method,
            amount: payment.amount,
            currency: payment.currency
        });
    } catch (error) {
        console.error(error);
        res.status(500).json("Failed to fetch payment details");
    }
};

module.exports = {
    createOrder,
    getPaymentDetails
};
