const {supabase} = require('../../config/dbconfig');

// Get all orders
exports.getOrders = async (req, res) => {
    const { status } = req.params;
    let query = supabase.from('view_orders').select('*');
    
    // Check if status is 'all'
    if (status !== 'ALL') {
        query = query.eq('status', status); // Filter by status
    }

    const { data, error } = await query;

    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
};


// Update order status
exports.updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const { data: orderDetails, error: checkError } = await supabase
            .from('orders')
            .select('*')
            .eq('order_id', id);

        if (checkError) throw checkError;
        if (!orderDetails || orderDetails.length === 0) {
            return res.status(404).json({ error: 'Order not found in orders.' });
        }

        // Update order status
        const { data: updatedOrder, error: updateError } = await supabase
            .from('orders')
            .update({ status })
            .eq('order_id', id);

        if (updateError) throw updateError;
        res.json(updatedOrder);
    } catch (error) {
        console.error("Error updating order status:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Insert a new order
exports.createOrder = async (req, res) => {
    const orderData = req.body;
    const { data, error } = await supabase.from('orders').insert(orderData).select();
    if (error) return res.status(400).json({ error: error.message });
    res.status(201).json(data);
};

// Delete an order

exports.deleteOrder = async (req, res) => {
    const { id } = req.params;

    try {
        // Check if order_id exists in order_details
        const { data: orderDetails, error: checkError } = await supabase
            .from('order_details')
            .select('*')
            .eq('order_id', id);

        if (checkError) throw checkError;
        if (!orderDetails || orderDetails.length === 0) {
            return res.status(404).json({ error: 'Order not found in order_details.' });
        }

        // Delete from order_details
        const { error: deleteOrderDetailsError } = await supabase
            .from('order_details')
            .delete()
            .eq('order_id', id);

        if (deleteOrderDetailsError) throw deleteOrderDetailsError;

        const { error: deleteOrderNotificationError } = await supabase
        .from('notification')
        .delete()
        .eq('order_id', id);

    if (deleteOrderNotificationError) throw deleteOrderNotificationError;


        // Delete from orders
        const { error: deleteOrdersError } = await supabase
            .from('orders')
            .delete()
            .eq('order_id', id);

        if (deleteOrdersError) throw deleteOrdersError;

        res.json({ message: 'Order deleted successfully.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
