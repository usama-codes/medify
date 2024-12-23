const express = require('express');
const otpController = require('../controller/otpController');
const router = express.Router();

// Routes for OTP operations
router.post('/generateotp', async (req, res) => {
  try {
    const { email } = req.body;

    // Validate the email before proceeding
    if (!email || typeof email !== 'string') {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    const otp = await otpController.generateOtp(email.toLowerCase()); // Pass normalized email
    res.status(200).json({ message: 'OTP generated successfully', otp });
  } catch (error) {
    console.error('Error generating OTP:', error.message);
    res.status(500).json({ error: error.message });
  }
});

router.post('/verifyotp', otpController.verifyOtp);

module.exports = router;
