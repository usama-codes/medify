const {supabase} = require('../config/dbconfig');  
  const jwt = require('jsonwebtoken');

  // Secret key to verify the JWT
  const jwtSecret = "pharwax"; 
  
  // Helper function to verify and decode JWT token
  const verifyToken = (token) => {
    try {
      return jwt.verify(token, jwtSecret);
    } catch (err) {
      return null;
    }
  };
// Assuming the fetchOrderNotification expects a query parameter for order_id
const fetchOrderNotification = async (req, res) => {
    const { order_id } = req.params;  // Access order_id from the route parameter
  
    if (!order_id) {
        return res.status(400).json({ message: 'order_id is required' });
    }
  
    try {
        const { data: orderNotification, error } = await supabase
            .from('order_notification')
            .select('*')
            .eq('order_id', order_id);
  
        if (error) {
            return res.status(500).json({ message: 'Error fetching order notification', error });
        }
  
        if (!orderNotification || orderNotification.length === 0) {
            return res.status(404).json({ message: 'Order not found' });
        }
  
        res.status(200).json(orderNotification);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal Server Error', error });
    }
};


// Assuming updatePharmacyId expects order_id in the body
const updatePharmacyId = async (req, res) => {
    const { order_id } = req.body;
    
    if (!order_id) {
        return res.status(400).json({ message: 'order_id is required' });
    }
  
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Authorization token is required' });
    }
  
    const decodedToken = verifyToken(token);
    if (!decodedToken || !decodedToken.userId) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
  
    const user_id = decodedToken.userId;
  
    try {
        const { data: pharmacy, error: fetchError } = await supabase
            .from('pharmacies')
            .select('pharmacy_id')
            .eq('user_id', user_id)
            .single();
  
        if (fetchError || !pharmacy) {
            return res.status(404).json({ message: 'Pharmacy not found for this user' });
        }
  
        const pharmacy_id = pharmacy.pharmacy_id;
  
        const { error } = await supabase
            .from('orders')
            .update({ pharmacy_id })
            .eq('order_id', order_id);
  
        if (error) {
            return res.status(500).json({ message: 'Error updating pharmacy_id', error });
        }
  
        res.status(200).json({ message: 'Pharmacy ID updated successfully' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal Server Error', error });
    }
};
  
  // Controller to update pharmacy_id in th
  module.exports={fetchOrderNotification,updatePharmacyId}