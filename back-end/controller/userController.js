require('dotenv').config();  // Load environment variables
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');  // Use jsonwebtoken library
const {supabase} = require('../config/dbconfig'); // Import Supabase client
const multer = require('multer');
const path = require('path');

// Multer configuration for license uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '..', 'uploads', 'licenses'));  // Correct path
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage });

// Signup function with OTP handling
const jwtSecret = "pharwax"; // Hard-coded JWT secret key



// Signup function
exports.signup = async (req, res) => {
    const { username, email, password, role } = req.body;

    try {
        console.log('Signup data:', { username, email, password, role });

        // Check if email already exists
        const { data: existingUser, error: checkEmailError } = await supabase
            .from('users')
            .select('user_id')
            .eq('email', email);

        if (checkEmailError) {
            console.error('Error checking email:', checkEmailError);
            return res.status(500).json({ error: 'Error checking email' });
        }

        if (existingUser && existingUser.length > 0) {
            return res.status(400).json({ message: 'Email already in use' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert the new user
        const { data: newUser, error: insertError } = await supabase
            .from('users')
            .insert([{ username, email, password: hashedPassword, role }])
            .select()
            .single();

        if (insertError) {
            console.error('Error inserting user:', insertError);
            return res.status(500).json({ error: insertError.message || 'Error creating user' });
        }

        // Generate a JWT token
        const token = jwt.sign(
            { userId: newUser.user_id, role: newUser.role,email:newUser.email },
            jwtSecret,
            { expiresIn: '1h' }
        );

        // Insert into `customers` or `pharmacies` based on role
        if (role === 'CUSTOMER') {
            const { data: customer, error: customerError } = await supabase
                .from('customers')
                .insert([{ user_id: newUser.user_id }])
                .select()
                .single();

            if (customerError) {
                console.error('Error inserting customer:', customerError);
                return res.status(500).json({ error: 'Error creating customer' });
            }

            if (!customer || !customer.customer_id) {
                return res.status(500).json({ error: 'Customer ID not returned after insertion' });
            }
        } else if (role === 'PHARMACY') {
            const { data: pharmacy, error: pharmacyError } = await supabase
                .from('pharmacies')
                .insert([{ user_id: newUser.user_id }])
                .select()
                .single();

            if (pharmacyError) {
                console.error('Error inserting pharmacy:', pharmacyError);
                return res.status(500).json({ error: 'Error creating pharmacy' });
            }

            if (!pharmacy || !pharmacy.pharmacy_id) {
                return res.status(500).json({ error: 'Pharmacy ID not returned after insertion' });
            }
        }

        // Success response
        res.status(201).json({
            message: 'User created successfully. Please verify OTP.',
            token,
            user: { user_id: newUser.user_id, username, email, role }
        });
    } catch (err) {
        console.error('Server error:', err);
        res.status(500).json({ error: 'Server error' });
    }
};

// Login function
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Fetch user details from the database
        const { data: userData, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();

        if (error || !userData || !(await bcrypt.compare(password, userData.password))) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: userData.user_id, role: userData.role,email:userData.email },
            jwtSecret,  // Use the hard-coded JWT_SECRET here
            { expiresIn: '1h' }
        );

        res.status(200).json({
            message: 'Login successful',
            token,
            user: { id: userData.user_id, email, role: userData.role }
        });
    } catch (err) {
        console.error('Server error:', err);
        res.status(500).json({ error: 'Server error' });
    }
};
// Add or Update User Details function
exports.addOrUpdateUserDetails = async (req, res) => {
    const { address, phone_number, city, pharmacy_name, owner_name } = req.body;
    const license_file = req.file ? req.file.path : null;

    try {
        const userId = req.userId;
        const userRole = req.userRole;

        // Set update fields based on user role (customer or pharmacy)
        const updates = userRole === 'CUSTOMER' ? { address, phone_number, city }
                     : { pharmacy_name, owner_name, address, phone_number, license_url: license_file };

        // Set table name based on user role
        const table = userRole === 'CUSTOMER' ? 'customers' : 'pharmacies';

        // Check if the user already has details in the corresponding table
        const { data: existingData, error: fetchError } = await supabase
            .from(table)
            .select('*')
            .eq('user_id', userId);

        if (fetchError) {
            return res.status(500).json({ error: 'Error checking existing data' });
        }

        // If data exists, update the details
        if (existingData && existingData.length > 0) {
            const { error: updateError } = await supabase
                .from(table)
                .update(updates)
                .eq('user_id', userId);

            if (updateError) {
                return res.status(500).json({ error: 'Error updating details' });
            }
        } else {
            // If no data exists, insert the new details
            const newUserData = { user_id: userId, ...updates };
            const { error: insertError } = await supabase.from(table).insert(newUserData);

            if (insertError) {
                return res.status(500).json({ error: 'Error adding details' });
            }
        }

        res.status(200).json({ message: `${userRole} details updated successfully` });
    } catch (error) {
        console.error('Error updating details:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
// Logout function
exports.logout = (req, res) => {
    try {
        // No action needed on the server-side for JWT logout
        // The client should remove the token from localStorage/cookies

        res.status(200).json({ message: 'Successfully logged out' });
    } catch (err) {
        console.error('Error during logout:', err);
        res.status(500).json({ error: 'Server error during logout' });
    }
};
