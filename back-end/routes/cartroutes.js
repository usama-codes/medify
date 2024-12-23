const express = require('express');
const { addToCart, getCart, clearCart,deleteCart,updateCart } = require('../controller/cartController');
const authenticateUser = require('../middleware/auth');

const router = express.Router();

// Add to cart
router.post('/add', authenticateUser, addToCart);

// Get cart
router.get('/', authenticateUser, getCart);

// Clear cart
router.delete('/clear', authenticateUser, clearCart);
router.delete('/deletecart',deleteCart);
router.put('/updatecart',updateCart);
module.exports = router;
