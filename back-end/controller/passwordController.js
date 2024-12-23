const bcrypt = require('bcrypt');
const supabase = require('../config/dbconfig');
const sendEmail = require('../utils/sendEmail');
const otpController=require('../controller/otpController')
// Forgot Password API
exports.forgotPassword = async (req, res) => {
  const  {email}  = req.body;
  try {
    

    console.log('Received forgot password request for:', email);

    // Check if user exists
    const { data: userData, error } = await supabase
      .from('users')
      .select('user_id')
      .eq('email', email)
      .single();

    if (error || !userData) {
      console.error('Error fetching user:', error);
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('User found:', userData);

    // Generate OTP
    const otp = await otpController.generateOtp(email);
    console.log('Generated OTP:', otp);

    // Send OTP via email
    await sendEmail(
      email,
      'Password Reset OTP',
      `Your One-Time Password (OTP) for password reset is:\n\n${otp}\n\nThis OTP will expire in 2 minutes.`
    );

    console.log('OTP sent to:', email);
    res.status(200).json({ message: 'Password reset OTP sent to email' });
  } catch (err) {
    console.error('Error in forgotPassword:', err);
    res.status(500).json({ error: 'An error occurred while processing the request' });
  }
};
exports.resetPassword = async (req, res) => {
    const { email, oldPassword, newPassword } = req.body;

    // Input validation
    if (!email || !oldPassword || !newPassword) {
        return res.status(400).json({ message: 'Email, old password, and new password are required' });
    }

    try {
        // Normalize email to avoid case/formatting issues
        const normalizedEmail = email.trim().toLowerCase();

        // Fetch the hashed password for the provided email
        const { data: user, error } = await supabase
            .from('users')
            .select('password')
            .eq('email', normalizedEmail)
            .single();

        console.log("Supabase Query Result:", user, error);

        if (error || !user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Log the old password and the retrieved hashed password
        console.log("Original Old Password Input:", oldPassword);
        const trimmedOldPassword = oldPassword.trim();
        console.log("Trimmed Old Password Input:", trimmedOldPassword);
        console.log("Hashed Password from DB:", user.password);
        

        // Compare the old password with the hashed password in the database
const isOldPasswordValid = await bcrypt.compare(trimmedOldPassword, user.password);
        console.log("Password Comparison Result:", isOldPasswordValid);

        if (!isOldPasswordValid) {
            return res.status(400).json({ message: 'Old password is incorrect' });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        console.log("Hashed New Password:", hashedPassword);

        // Update the password in the database
        const { error: updateError } = await supabase
            .from('users')
            .update({ password: hashedPassword })
            .eq('email', normalizedEmail);

        if (updateError) {
            console.error('Error updating password:', updateError);
            return res.status(500).json({ error: 'Failed to update password' });
        }

        res.status(200).json({ message: 'Password reset successful' });
    } catch (err) {
        console.error('Server error:', err);
        res.status(500).json({ error: 'An error occurred while resetting password' });
    }
};
