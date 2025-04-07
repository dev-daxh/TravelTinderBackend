const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// Route for creating an order
router.post('/make-payment', paymentController.createOrder);

// Route for fetching payment details by paymentId
router.get('/payment/:paymentId', paymentController.getPaymentDetails);

module.exports = router;
