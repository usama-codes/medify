const {supabase} = require('../../config/dbconfig');
const bcrypt = require('bcrypt');
// Get all users
exports.getCustomers = async (req, res) => {
    const { data, error } = await supabase.from('view_customers').select('*');
    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
};

// Insert a user
exports.createCustomers = async (req, res) => {
    const { customer_name, email, password, address, phone_number, wallet_balance, created_at } = req.body;

    try {
        // Step 1: Hash the password before inserting into 'users' table
        const hashedPassword = await bcrypt.hash(password, 10); // Salt rounds set to 10

        // Step 2: Create a new user in the 'users' table
        const { data: userData, error: userError } = await supabase
            .from('users')
            .insert({
                username: customer_name, // Pass customer_name as username
                email,
                password: hashedPassword,
                role:'CUSTOMER',  // Store hashed password
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
        const { data: customerData, error: customerError } = await supabase
            .from('customers')
            .insert({
                user_id,
                address: address || null, // Optional fields handled
                phone_number: phone_number || null,
                wallet_balance: wallet_balance || 0, // Default value for wallet_balance
                created_at: created_at || new Date().toISOString(), // Default current timestamp if not provided
            })
            .select();

        if (customerError) {
            throw customerError;
        }

        // Step 4: Respond with the created customer details
        res.status(201).json({
            message: 'Customer created successfully.',
            user: userData[0],
            customer: customerData[0],
        });
    } catch (error) {
        console.error('Error creating customer:', error.message);
        res.status(400).json({
            message: 'An error occurred while creating the customer.',
            error: error.message,
        });
    }
};
exports.updateCustomers = async (req, res) => {
    const { customer_id } = req.params; // Extract customer_id from the route parameter
    const {
        customer_name,
        email,
        address,
        phone_number,
        wallet_balance,
        created_at,
    } = req.body; // Extract fields to update from the request body

    try {
        // Fetch the current email and user_id using view_customers
        const { data: viewCustomerData, error: viewFetchError } = await supabase
            .from('view_customers')
            .select('user_id, email') // Fetch user_id and email from the view
            .eq('customer_id', customer_id)
            .single();

        if (viewFetchError || !viewCustomerData) {
            return res.status(404).json({ message: 'Customer not found.' });
        }

        const user_id = viewCustomerData.user_id;
        const currentEmail = viewCustomerData.email;

        // Determine if email needs to be updated
        const shouldUpdateEmail = email && email !== currentEmail;

        // Update users table
        if (customer_name || shouldUpdateEmail) {
            const { error: userUpdateError } = await supabase
                .from('users')
                .update({
                    username: customer_name || undefined,
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

        // Update customers table
        const { error: customerUpdateError } = await supabase
            .from('customers')
            .update({
                address: address || undefined,
                phone_number: phone_number || undefined,
                wallet_balance: wallet_balance || undefined,
                created_at: created_at || undefined,
            })
            .eq('customer_id', customer_id);

        if (customerUpdateError) {
            throw customerUpdateError;
        }

        // Respond with success
        res.status(200).json({ message: 'Customer details updated successfully.' });
    } catch (error) {
        console.error('Error updating customer details:', error);
        res.status(500).json({
            message: 'An error occurred while updating customer details.',
            error,
        });
    }
};

exports.deleteCustomers = async (req, res) => {
    const { id } = req.params;
    try {
        // Delete from customers
        const { error: customerError } = await supabase.from('customers').delete().eq('customer_id', id);
        if (customerError) throw customerError;

        // Delete from users using user_id
        const { error: userError } = await supabase.from('users').delete().eq('user_id', id);
        if (userError) throw userError;

        res.json({ message: 'Customer deleted successfully.' });
    } catch (error) {
        console.error(error.message);
        res.status(400).json({ error: error.message });
    }
};



const handleDatabaseError = (res, error) => {
    if (error) {
        return res.status(500).json({ error: error.message });
    }
};

exports.getSummary = async (req, res) => {
    try {
        // Fetch all summaries concurrently
        const queries = [
            supabase.from("medicine_summary").select("*"),
            supabase.from("order_summarys").select("*"),
            supabase.from("users_summary").select("*"),
            supabase.from("pharmacy_summary").select("*"),
            supabase.from("customers_summary").select("*"),
        ];

        // Await all results
        const results = await Promise.all(queries);

        // Validate each result and extract data and error
        const [medicineSummary, orderSummary, userSummary, pharmacySummary,customersSummary] = results.map((result, index) => {
            if (!result || result.error) {
                throw new Error(
                    `Error fetching summary for ${
                        ["medicine", "order", "users", "pharmacy","customers"][index]
                    }: ${result?.error?.message || "Unknown error"}`
                );
            }
            return result.data;
        });

        // Send response with all summaries
        res.status(200).json({
            medicineSummary,
            orderSummary,
            userSummary,
            pharmacySummary,
            customersSummary,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};




