const supabase = require('../config/dbconfig');

exports.placeOrder = async (req, res) => {
    const userId = req.userId; // Get the userId from the JWT token (middleware)
    const { shipmentDetails } = req.body;

    try {
        // Fetch cart items for the authenticated user
        let cartItems;
        try {
            const { data, error } = await supabase
                .from('cart')
                .select('medicine_id, quantity, price')
                .eq('user_id', userId);

            if (error) throw error;
            cartItems = data;

            if (!cartItems.length) {
                return res.status(400).json({ message: 'Cart is empty.' });
            }
        } catch (err) {
            console.error('Error fetching cart items:', err.message);
            throw new Error('Failed to fetch cart items.');
        }

        // Calculate the total price of the order
        let totalPrice;
        try {
            totalPrice = cartItems.reduce(
                (sum, item) => sum + item.quantity * item.price,
                0
            );
        } catch (err) {
            console.error('Error calculating total price:', err.message);
            throw new Error('Failed to calculate total price.');
        }

        // Create a new order
        let order;
        try {
            const { data, error } = await supabase
                .from('orders')
                .insert({ user_id: userId, total_price: totalPrice })
                .select('order_id')
                .single();

            if (error) throw error;
            order = data;
        } catch (err) {
            console.error('Error creating order:', err.message);
            throw new Error('Failed to create the order.');
        }

        // Create order details for each item in the cart
        try {
            const orderDetails = cartItems.map(item => ({
                order_id: order.order_id,
                medicine_id: item.medicine_id,
                quantity: item.quantity,
                price: item.price
            }));

            const { error } = await supabase.from('order_details').insert(orderDetails);
            if (error) throw error;
        } catch (err) {
            console.error('Error inserting order details:', err.message);
            throw new Error('Failed to insert order details.');
        }

        // Insert shipment details into the shipment table
        try {
            const shipmentData = {
                order_id: order.order_id,
                user_id: userId,
                address: shipmentDetails.address,
                phone: shipmentDetails.phone,
                email: shipmentDetails.email,
                status: 'PENDING' // Default shipment status
            };
            const { error } = await supabase.from('shipment').insert(shipmentData);
            if (error) throw error;
        } catch (err) {
            console.error('Error inserting shipment details:', err.message);
            throw new Error('Failed to insert shipment details.');
        }

        // Clear the user's cart after placing the order
        try {
            const { error } = await supabase.from('cart').delete().eq('user_id', userId);
            if (error) throw error;
        } catch (err) {
            console.error('Error clearing the cart:', err.message);
            throw new Error('Failed to clear the cart.');
        }

        // Send notifications to pharmacies about the new order
        try {
            const { data: pharmacies, error: pharmacyError } = await supabase
                .from('pharmacies')
                .select('pharmacy_id');
            if (pharmacyError) throw pharmacyError;

            const notifications = pharmacies.map(pharmacy => ({
                pharmacy_id: pharmacy.pharmacy_id,
                order_id: order.order_id,
                notification_msg: `New order placed with ID ${order.order_id}`
            }));

            const { error: notificationError } = await supabase.from('notification').insert(notifications);
            if (notificationError) throw notificationError;
        } catch (err) {
            console.error('Error sending notifications to pharmacies:', err.message);
            throw new Error('Failed to send notifications.');
        }

        res.status(200).json({ message: 'Order placed successfully.' });
    } catch (error) {
        console.error('General error in placeOrder function:', error.message);
        res.status(500).json({ error: error.message });
    }
};

// Function to subscribe to cart changes
const subscribeToCartChanges = (userId, callback) => {
    const subscription = supabase
        .channel('cart-changes')
        .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'cart', filter: `user_id=eq.${userId}` },
            async (payload) => {
                console.log('Change detected in cart:', payload);

                // Fetch updated cart items
                const { data: cartItems, error } = await supabase
                    .from('cart')
                    .select('quantity, price')
                    .eq('user_id', userId);

                if (error) {
                    console.error('Error fetching cart items:', error.message);
                    return callback(null, error.message);
                }

                // Recalculate total price
                const totalPrice = cartItems.reduce((sum, item) => sum + item.quantity * item.price, 0);
                callback(totalPrice, null);
            }
        )
        .subscribe();

    return subscription;
};

exports.totalAmount = async (req, res) => {
    try {
        const userId = req.userId;

        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized. User ID is required.' });
        }

        // Fetch initial total amount
        const { data: cartItems, error } = await supabase
            .from('cart')
            .select('quantity, price')
            .eq('user_id', userId);

        if (error) {
            console.error('Error fetching cart items:', error.message);
            return res.status(500).json({ message: 'Failed to fetch cart items.' });
        }

        const initialTotalPrice = cartItems.reduce((sum, item) => sum + item.quantity * item.price, 0);

        // Subscribe to Realtime changes
        subscribeToCartChanges(userId, (updatedTotal, err) => {
            if (err) {
                console.error('Realtime subscription error:', err);
                return;
            }
            console.log('Updated total amount:', updatedTotal);
            // Optionally, push updates to clients using WebSocket/Socket.IO
        });

        res.status(200).json({ totalAmount: initialTotalPrice });
    } catch (err) {
        console.error('General error in totalAmount function:', err.message);
        res.status(500).json({ message: 'Failed to calculate total amount.' });
    }
};


exports.acceptOrder = async (req, res) => {
    const { pharmacyId, orderId } = req.body;  // Get the pharmacyId and orderId from the request body

    try {
        // Check if the order exists and is in 'PENDING' status
        const { data: order, error: orderError } = await supabase
            .from('orders')
            .select('status, USER_ID')
            .eq('order_id', orderId)
            .single();

        if (orderError) throw orderError;

        if (order && order.status !== 'PENDING') {
            return res.status(400).json({ message: 'Order cannot be accepted as it is not in pending status.' });
        }

        // Update the order status to 'ACCEPTED' and assign the pharmacy to the order
        const { error: updateError } = await supabase
            .from('orders')
            .update({ STATUS: 'ACCEPTED', PHARMACY_ID: pharmacyId })
            .eq('order_id', orderId);

        if (updateError) throw updateError;

        // Fetch user information to send email
        const { data: user, error: userError } = await supabase
            .from('users')
            .select('email, name')
            .eq('user_id', order.USER_ID)
            .single();

        if (userError) throw userError;

        // Fetch order details
        const { data: orderDetails } = await supabase
            .from('order_details')
            .select('quantity,medicine_id,price')
            .eq('order_id', orderId);

        // Create order summary for the email
        let orderSummary = orderDetails.map(item => {
            return `${item.MEDICINES.NAME} (x${item.QUANTITY}) - $${item.QUANTITY * item.PRICE}`;
        }).join('\n');

        const orderMessage = `
            Dear ${user.name},

            Your order with Order ID: ${orderId} has been ACCEPTED by a pharmacy.

            Order Details:
            ${orderSummary}

            Total Price: $${order.TOTAL_PRICE}

            You will be notified once the order is shipped.

            Thank you for choosing us!

            Best Regards,
            Your PharwaX
        `;

        // Send email to the user
        await sendEmail({
            to: user.email,
            subject: `Your Order #${orderId} Has Been Accepted`,
            message: orderMessage
        });

        // Remove all notifications related to the accepted order
        const { error: notificationError } = await supabase
            .from('notification')
            .delete()
            .eq('order_id', orderId);

        if (notificationError) throw notificationError;

        res.status(200).json({ message: 'Order accepted, notifications cleared, and email sent to user.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
