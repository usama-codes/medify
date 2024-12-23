const {supabase} = require('../config/dbconfig'); // Supabase client configuration
const jwt = require('jsonwebtoken'); // For decoding the token
const JWT_SECRET = 'pharwax';

// Helper to extract user_id from token
const extractUserIdFromToken = (req) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) throw new Error('Authorization header missing');

    const token = authHeader.split(' ')[1]; // Extract the token
    if (!token) throw new Error('Token not found');

    // Verify the token with the hardcoded secret key
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded.userId; // Assuming the userId is in the token payload
};


// Function to get pharmacy_id based on user_id
const getPharmacyId = async (user_id) => {
    try {
        const { data: pharmacyData, error: pharmacyError } = await supabase
            .from('pharmacies')  // Ensure the table name is correct, it should be 'pharmacies' if that's the table
            .select('pharmacy_id')
            .eq('user_id', user_id)
            .single();  // Fetching one row

        if (pharmacyError) {
            throw new Error('Error fetching pharmacy_id for the user: ' + pharmacyError.message);
        }

        return pharmacyData.pharmacy_id;  // Return the pharmacy_id if found
    } catch (err) {
        console.error('Error fetching pharmacy_id:', err.message);
        throw new Error('Failed to fetch pharmacy_id for the user');
    }
};


// API Controllers

// 1. Today's Selling Drug
const getTodaysSellingDrug = async (req, res) => {
    try {
        // Decode user_id from token
        const user_id = extractUserIdFromToken(req);
        console.log('Extracted user_id:', user_id); // Log extracted user_id for debugging
        const pharmacy_id = await getPharmacyId(user_id);
        console.log('Resolved pharmacy_id:', pharmacy_id); // Log resolved pharmacy_id

        // Retrieve the pharmacy_id from the pharmacy table using the user_id
        
        const today = new Date().toISOString().split('T')[0]; // Format date as YYYY-MM-DD
        console.log('Today\'s date:', today); // Log the formatted date

        // Call the Supabase RPC function with pharmacy_id
        const { data, error } = await supabase.rpc('todays_selling_drug', { pharmacy_id_input: pharmacy_id, today });

        // Handle any errors from the RPC call
        if (error) {
            console.error('RPC Error:', error); // Log detailed error
            return res.status(500).json({ error: 'Failed to fetch today\'s selling drug' });
        }

        // Check if data is empty and log the response
        if (!data || data.length === 0) {
            console.log('No data returned for the given pharmacy and date.');
        } else {
            console.log('Data returned:', data); // Log the returned data
        }

        // Return the response with the drug data
        res.json({ drugs: data });
    } catch (err) {
        console.error('Server error:', err.message); // Log any server-side errors
        res.status(500).json({ error: err.message });
    }
};


// 2. Top-Selling Product with Sales
const getTopSellingProductWithSales = async (req, res) => {
    try {
        const user_id = extractUserIdFromToken(req);

        const pharmacy_id = await getPharmacyId(user_id);
        console.log('Resolved pharmacy_id:', pharmacy_id); // Log resolved pharmacy_id

        const { data, error } = await supabase.rpc('top_selling_product_with_sales', { pharmacy_id_input: pharmacy_id });

        if (error) {
            console.error("RPC Error:", error);
            return res.status(500).json({ error: 'Failed to fetch top-selling product with sales' });
        }

        res.json({ topProduct: data });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: err.message });
    }
};

// 3. Completed Orders Count
const getCompletedOrdersCount = async (req, res) => {
    try {
        const user_id = extractUserIdFromToken(req);
        const pharmacy_id = await getPharmacyId(user_id);
        console.log('Resolved pharmacy_id:', pharmacy_id); // Log resolved pharmacy_id

        const { data, error } = await supabase.rpc('completed_orders_count', { pharmacy_id_input: pharmacy_id });

        if (error) {
            console.error("RPC Error:", error);
            return res.status(500).json({ error: 'Failed to fetch completed orders count' });
        }

        res.json({ completedOrdersCount: data });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: err.message });
    }
};

// 4. Revenue Growth Comparison
const getRevenueGrowthComparison = async (req, res) => {
    try {
        const user_id = extractUserIdFromToken(req);
        const pharmacy_id = await getPharmacyId(user_id);
        console.log('Resolved pharmacy_id:', pharmacy_id); // Log resolved pharmacy_id

        const currentMonth = parseInt(new Date().getMonth() + 1);
        const previousMonth = currentMonth === 1 ? 12 : parseInt(currentMonth - 1);

        if (currentMonth < 1 || currentMonth > 12 || previousMonth < 1 || previousMonth > 12) {
            return res.status(400).json({ error: 'Invalid or missing month. Must be between 1 and 12.' });
        }

        console.log('Supabase RPC Inputs:', { pharmacy_id_input: pharmacy_id, current_month: currentMonth, previous_month: previousMonth });

        const { data, error } = await supabase.rpc('revenue_growth_comparison', {
            pharmacy_id_input: pharmacy_id,
            current_month: currentMonth,
            previous_month: previousMonth
        });

        if (error) {
            console.error("RPC Error:", error);
            return res.status(500).json({ error: 'Failed to fetch revenue growth comparison' });
        }

        if (!data || data.length === 0) {
            return res.status(404).json({ error: 'No data available for revenue growth comparison' });
        }

        res.json({ revenueGrowth: data });
    } catch (err) {
        console.error('Error:', err.message);
        res.status(500).json({ error: err.message });
    }
};

// 5. Top Customers
const getTopCustomers = async (req, res) => {
    try {
        const user_id = extractUserIdFromToken(req);
        const pharmacy_id = await getPharmacyId(user_id);
        console.log('Resolved pharmacy_id:', pharmacy_id); // Log resolved pharmacy_id

        const { data, error } = await supabase.rpc('top_customers', { pharmacy_id_input: pharmacy_id });

        if (error) {
            console.error("RPC Error:", error);
            return res.status(500).json({ error: 'Failed to fetch top customers' });
        }

        res.json({ topCustomers: data });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: err.message });
    }
};
const get_orders_status = async (req, res) => {
    const user_id = extractUserIdFromToken(req);
    console.log('Extracted user_id:', user_id); // Log extracted user_id for debugging
    const pharmacy_id = await getPharmacyId(user_id);
    console.log('Resolved pharmacy_id:', pharmacy_id); // Log resolved pharmacy_id

    try {
        // Call the stored function `get_orders_by_pharmacy_status`
        const { data, error } = await supabase
            .rpc('get_orders_by_pharmacy_status', {
                pharmacy_id_input: pharmacy_id,
                
            });

        if (error) {
            return res.status(500).json({
                success: false,
                message: 'Error fetching orders',
                error: error.message,
            });
        }

        // Return the data as a response
        res.status(200).json({
            success: true,
            data: data,
        });
    } catch (error) {
        console.error('Error in get_orders_status:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch orders',
            error: error.message,
        });
    }
};
// 6. Pending Orders
const getPendingOrders = async (req, res) => {
    try {
        const user_id = extractUserIdFromToken(req);
        const pharmacy_id = await getPharmacyId(user_id);
        console.log('Resolved pharmacy_id:', pharmacy_id); // Log resolved pharmacy_id

        const { data, error } = await supabase
            .from('orders')
            .select('*')
            .eq('pharmacy_id', pharmacy_id)
            .eq('status', 'PENDING')
            .order('created_at', { ascending: false });

        if (error) {
            console.error("Error fetching pending orders:", error);
            return res.status(500).json({ error: 'Failed to fetch pending orders' });
        }

        res.json({ pendingOrders: data });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: err.message });
    }
};

// 7. Pending Order Count
const getPendingOrderCount = async (req, res) => {
    try {
        const user_id = extractUserIdFromToken(req);
        const pharmacy_id = await getPharmacyId(user_id);
        console.log('Resolved pharmacy_id:', pharmacy_id); // Log resolved pharmacy_id

        const { data, error } = await supabase.rpc('pending_order_count', { pharmacy_id_input: pharmacy_id });

        if (error) {
            console.error("RPC Error:", error);
            return res.status(500).json({ error: 'Failed to fetch pending order count' });
        }

        res.json({ pendingOrderCount: data });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: err.message });
    }
};

// 8. Monthly Revenue
const getMonthlyRevenue = async (req, res) => {
    const { month } = req.query;
    if (!month || isNaN(month) || month < 1 || month > 12) {
        return res.status(400).json({ error: 'Invalid or missing month. Must be between 1 and 12.' });
    }

    try {
        const user_id = extractUserIdFromToken(req);
        const year = new Date().getFullYear();
        const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
        const endDate = new Date(year, month, 0).toISOString().split('T')[0];

        const { data, error } = await supabase
            .from('orders')
            .select('total_price')
            .eq('pharmacy_id', user_id)
            .gte('created_at', startDate)
            .lte('created_at', endDate);

        if (error) {
            console.error(error);
            return res.status(500).json({ error: 'Failed to fetch revenue data' });
        }

        const totalRevenue = data.reduce((acc, order) => acc + order.total_price, 0);

        res.json({ totalRevenue });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: err.message });
    }
};

// 9. Today's Revenue
const getTodaysRevenue = async (req, res) => {
    try {
        const user_id = extractUserIdFromToken(req);
        const today = new Date().toISOString().split('T')[0];
        const pharmacy_id = await getPharmacyId(user_id);
        console.log('Resolved pharmacy_id:', pharmacy_id); // Log resolved pharmacy_id

        const { data, error } = await supabase.rpc('todays_revenue', { pharmacy_id_input: pharmacy_id, today });

        if (error) {
            console.error("RPC Error:", error);
            return res.status(500).json({ error: 'Failed to fetch today\'s revenue' });
        }

        res.json({ todaysRevenue: data });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: err.message });
    }
};

// 10. Shipped Orders Count
const getShippedOrdersCount = async (req, res) => {
    try {
        const user_id = extractUserIdFromToken(req);
        const pharmacy_id = await getPharmacyId(user_id);
        console.log('Resolved pharmacy_id:', pharmacy_id); // Log resolved pharmacy_id

        const { data, error } = await supabase.rpc('count_shipped_orders', { pharmacy_id_input: pharmacy_id });

        if (error) {
            console.error('Error fetching shipped orders count:', error);
            return res.status(500).json({ error: 'Failed to fetch shipped orders count' });
        }

        res.json({ shippedOrdersCount: data });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: err.message });
    }
};

// 11. Cancelled Orders Count
const getCancelledOrdersCount = async (req, res) => {
    try {
        const user_id = extractUserIdFromToken(req);
        const pharmacy_id = await getPharmacyId(user_id);
        console.log('Resolved pharmacy_id:', pharmacy_id); // Log resolved pharmacy_id

        const { data, error } = await supabase.rpc('count_cancelled_orders', { pharmacy_id_input: pharmacy_id });

        if (error) {
            console.error('Error fetching cancelled orders count:', error);
            return res.status(500).json({ error: 'Failed to fetch cancelled orders count' });
        }

        res.json({ cancelledOrdersCount: data });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: err.message });
    }
};



const gettotalOrdersCount = async (req, res) => {
    try {
        const user_id = extractUserIdFromToken(req);
        const pharmacy_id = await getPharmacyId(user_id);
        console.log('Resolved pharmacy_id:', pharmacy_id); // Log resolved pharmacy_id

        const { data, error } = await supabase.rpc('count_total_orders', { pharmacy_id_input: pharmacy_id });

        if (error) {
            console.error('Error fetching total orders count:', error);
            return res.status(500).json({ error: 'Failed to fetch total orders count' });
        }

        res.json({ totalOrdersCount: data });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: err.message });
    }
};
const editOrder = async (req, res) => {
    const { order_id } = req.params; // Order ID from the URL parameter
    const { status } = req.body; // Status to update the order with
  
    // Check if the status is valid (you can expand this validation as needed)
    const validStatuses = ['PENDING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: 'Invalid status value' });
    }

    try {
        // Attempt to update the order status in the 'orders' table
        const { error } = await supabase
            .from('orders')
            .update({ status })
            .eq('order_id', order_id);

        // If there is an error while updating the order
        if (error) {
            console.error("Error updating order status:", error);  // Log the error for debugging
            return res.status(500).json({ message: 'Error updating order status', error: error.message });
        }

        // If no rows were updated, that means the order was not found
        /*if (!data || data.length === 0) {
            console.error(`Order with ID ${order_id} not found`);  // Log the error for debugging
            return res.status(404).json({ message: 'Order not found' });
        }*/

        // Successfully updated the order status
        res.status(200).json({ message: 'Order status updated successfully' });
    } catch (error) {
        // Catch any unexpected errors and log them
        console.error("Unexpected error in editOrder:", error);  // Log the error for debugging
        res.status(500).json({ message: 'Error updating order status', error: error.message });
    }
};

  // Delete Order - Delete from orders and order_details
  const deleteOrder = async (req, res) => {
    const { id } = req.params; // Order ID from the URL parameter
  
    try {
      // First, delete from the order_details table
      const { error: deleteNotificationError } = await supabase
        .from('notification')
        .delete()
        .eq('order_id', id);
  
      if (deleteNotificationError) {
        return res.status(500).json({ message: 'Error deleting from notification', error: deleteNotificationError });
      }
  
      
      const { error: deleteOrderDetailsError } = await supabase
        .from('order_details')
        .delete()
        .eq('order_id', id);
  
      if (deleteOrderDetailsError) {
        return res.status(500).json({ message: 'Error deleting from order_details', error: deleteOrderDetailsError });
      }
  
      // Then, delete from the orders table
      const { error: deleteOrderError } = await supabase
        .from('orders')
        .delete()
        .eq('order_id', id);
  
      if (deleteOrderError) {
        return res.status(500).json({ message: 'Error deleting order', error: deleteOrderError });
      }
  
      res.status(200).json({ message: 'Order and associated details deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error deleting order' });
    }
  };
  
// Export Controllers
module.exports = {
    getTodaysSellingDrug,
    getTopSellingProductWithSales,
    getCompletedOrdersCount,
    getRevenueGrowthComparison,
    getTopCustomers,
    getPendingOrders,
    getPendingOrderCount,
    getMonthlyRevenue,
    getTodaysRevenue,
    getShippedOrdersCount,
    getCancelledOrdersCount,
    gettotalOrdersCount,
    get_orders_status,
    deleteOrder,editOrder
};
