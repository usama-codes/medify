const express = require('express');
const { placeOrder, acceptOrder, totalAmount } = require('../controller/orderController');
const authenticateUser = require('../middleware/auth');  // JWT authentication middleware
const router = express.Router();

// Route for placing an order (authenticated user)
router.post('/place-order', authenticateUser, placeOrder);

// Route for accepting an order (only pharmacies should be able to accept orders)
router.post('/accept-order', authenticateUser, acceptOrder);
router.post('/total-amount',authenticateUser,totalAmount);
module.exports = router;
