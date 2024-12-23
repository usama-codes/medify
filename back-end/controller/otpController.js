const {supabase} = require('../config/dbconfig'); // Assuming you've set up the Supabase client
const sendEmail = require('../utils/sendEmail'); // Assuming you have a utility to send emails
exports.generateOtp = async (email) => {
  try {
    console.log("Normalized email received:", email);

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email);

    if (error) {
      console.error("Supabase query error:", error);
      throw new Error("Database query failed");
    }

    if (!data || data.length === 0) {
      console.log(`No user found with email: ${email}`);
      throw new Error("User not found");
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 2 * 60000);

    const { error: updateError } = await supabase
      .from("users")
      .update({ otp_generated: otp, otp_expiry: otpExpiry })
      .eq("email", email);

    if (updateError) {
      console.error("Error updating OTP:", updateError);
      throw new Error("Failed to update OTP");
    }

    await sendEmail(
      email,
      "Your OTP Code",
      `Your OTP code is ${otp}. It will expire in 2 minutes.`
    );
    return otp;
  } catch (error) {
    console.error("Error in generateOtp:", error.message);
    throw error;
  }
};

// Verify OTP
exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    // Check if the OTP is valid and not expired
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .eq('otp_generated', otp)
      .gt('otp_expiry', new Date().toISOString());

    if (error) throw error;

    if (!data || data.length === 0) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Clear the OTP after successful verification
    const { error: updateError } = await supabase
      .from('users')
      .update({ otp_generated: null, otp_expiry: null })
      .eq('email', email);

    if (updateError) throw updateError;

    res.send('OTP verified successfully');
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred while verifying OTP' });
  }
};
