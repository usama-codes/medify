const {supabase} = require('../../config/dbconfig');
const bcrypt = require('bcrypt');


// Get all users
exports.getPharmacies = async (req, res) => {
    const { data, error } = await supabase.from('view_pharmacies').select('*');
    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
};

// Insert a user
exports.createPharmacies = async (req, res) => {
    const { pharmacy_ownner, email, password,pharmacy_name, address, phone_number, license_url, created_at } = req.body;

    try {
        // Step 1: Hash the password before inserting into 'users' table
        const hashedPassword = await bcrypt.hash(password, 10); // Salt rounds set to 10

        // Step 2: Create a new user in the 'users' table
        const { data: userData, error: userError } = await supabase
            .from('users')
            .insert({
                username: pharmacy_name, // Pass customer_name as username
                email,
                password: hashedPassword,
                role:'PHARMACY',  // Store hashed password
            })
            .select(); // Select to return the created user data

        if (userError) {
            if (userError.code === '23505') {
                // Duplicate email error
                return res.status(400).json({
                    message: 'Email already exists. Please use a different email address.',
                });
            }
            throw userError;
        }

        const user_id = userData[0]?.user_id; // Ensure we get the created user's ID

        // Step 3: Use the returned user_id to insert into the 'customers' table
        const { data: pharmacyData, error: pharmacyError } = await supabase
            .from('pharmacies')
            .insert({
                user_id,
                address: address || null, // Optional fields handled
                phone_number: phone_number || null,
                pharmacy_name: pharmacy_name || null,
                license_url:license_url||null, // Default value for wallet_balance
                created_at: created_at || new Date().toISOString(), // Default current timestamp if not provided
            })
            .select();

        if (pharmacyError) {
            throw pharmacyError;
        }

        // Step 4: Respond with the created customer details
        res.status(201).json({
            message: 'Pharmacy created successfully.',
            user: userData[0],
            pharmacy: pharmacyData[0],
        });
    } catch (error) {
        console.error('Error creating pharmacy:', error.message);
        res.status(400).json({
            message: 'An error occurred while creating the customer.',
            error: error.message,
        });
    }
};
// Update a user
exports.updatePharmacies = async (req, res) => {
    const { pharmacy_id } = req.params; // Extract pharmacy_id from the route parameter
    const {
        pharmacy_name,
        owner_name,
        license,
        address,
        phone_number,
        email,
        created_at,
    } = req.body; // Extract fields to update from the request body

    try {
        // Fetch the current email and user_id using view_pharmacies
        const { data: viewPharmacyData, error: viewFetchError } = await supabase
            .from('view_pharmacies')
            .select('user_id, email') // Fetch user_id and email from the view
            .eq('pharmacy_id', pharmacy_id)
            .single();

        if (viewFetchError || !viewPharmacyData) {
            return res.status(404).json({ message: 'Pharmacy not found.' });
        }

        const user_id = viewPharmacyData.user_id;
        const currentEmail = viewPharmacyData.email;

        // Determine if email needs to be updated
        const shouldUpdateEmail = email && email !== currentEmail;

        // Update users table
        if (owner_name || shouldUpdateEmail) {
            const { error: userUpdateError } = await supabase
                .from('users')
                .update({
                    username: owner_name || undefined,
                    email: shouldUpdateEmail ? email : undefined, // Only pass email if it needs to be updated
                })
                .eq('user_id', user_id);

            if (userUpdateError) {
                if (userUpdateError.code === '23505') {
                    return res.status(400).json({
                        message: 'Email already exists. Please use a different email address.',
                    });
                }
                throw userUpdateError;
            }
        }

        // Update pharmacies table
        const { error: pharmacyUpdateError } = await supabase
            .from('pharmacies')
            .update({
                pharmacy_name: pharmacy_name || undefined,
                license: license || undefined,
                address: address || undefined,
                phone_number: phone_number || undefined,
                created_at: created_at || undefined,
            })
            .eq('pharmacy_id', pharmacy_id);

        if (pharmacyUpdateError) {
            throw pharmacyUpdateError;
        }

        // Respond with success
        res.status(200).json({ message: 'Pharmacy details updated successfully.' });
    } catch (error) {
        console.error('Error updating pharmacy details:', error);
        res.status(500).json({
            message: 'An error occurred while updating pharmacy details.',
            error,
        });
    }
};

// Delete a user
exports.deletePharmacies = async (req, res) => {
    const { id } = req.params;
    try {
        // Delete from customers
        const{error:orderError}=await supabase.from('orders').update({pharmacy_id:null}).eq('pharmacy_id',id);
        if (orderError) throw orderError;
       
        
        const{error:notificationError}=await supabase.from('notification').delete().eq('pharmacy_id',id);
        if (notificationError) throw notificationError;

        const { error: pharmacyError } = await supabase.from('pharmacies').delete().eq('pharmacy_id', id);
        if (pharmacyError) throw pharmacyError;

        // Delete from users using user_id
        const { error: userError } = await supabase.from('users').delete().eq('user_id', id);
        if (userError) throw userError;

        res.json({ message: 'Pharmacy deleted successfully.' });
    } catch (error) {
        console.error(error.message);
        res.status(400).json({ error: error.message });
    }
};

exports.gettopPharmacies = async (req, res) => {
    const { data, error } = await supabase.from('view_top_selling_pharmacies').select('*');
    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
};
