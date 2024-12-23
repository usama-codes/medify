const express = require("express");
const passwordController = require("../controller/passwordController");
const router = express.Router();

// Define routes
router.post('/forgotpassword', passwordController.forgotPassword);
router.post('/resetpassword', passwordController.resetPassword);

module.exports = router;
