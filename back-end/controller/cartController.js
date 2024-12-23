const supabase = require('../config/dbconfig');
exports.addToCart = async (req, res) => {
    const { medicineId, quantity } = req.body;
    const userId = req.userId; // Extracted from the JWT token via auth middleware

    console.log('User ID:', userId); // Log to check if userId is set correctly
    console.log('Medicine ID:', medicineId); // Log to check if medicineId is passed correctly

    if (!medicineId || !quantity || !userId) {
        return res.status(400).json({ error: 'Missing userId, medicineId, or quantity' });
    }

    try {
        // Fetch the price of the medicine
        const { data: medicineData, error: fetchMedicineError } = await supabase
            .from('medicines')
            .select('price')
            .eq('medicine_id', medicineId)
            .single();

        if (fetchMedicineError) {
            return res.status(500).json({ error: 'Error fetching medicine price: ' + fetchMedicineError.message });
        }

        if (!medicineData) {
            return res.status(404).json({ error: 'Medicine not found' });
        }

        const price = medicineData.price;
        const totalPrice = price * quantity; // Calculate the total price

        // Check if the medicine is already in the cart
        const { data: existingCartItem, error: fetchError } = await supabase
            .from('cart')
            .select('*')
            .eq('user_id', userId)
            .eq('medicine_id', medicineId)
            .maybeSingle();

        if (fetchError) {
            return res.status(500).json({ error: 'Error fetching cart item: ' + fetchError.message });
        }

        if (existingCartItem) {
            // Return a message if the medicine already exists in the cart
            return res.status(400).json({ message: 'Product already exists in the cart' });
        } else {
            // Add new item to the cart with calculated price
            await supabase
                .from('cart')
                .insert({ user_id: userId, medicine_id: medicineId, quantity: quantity, price: totalPrice });

            res.status(200).json({ message: 'Product added to cart.' });
        }
    } catch (error) {
        console.error('Error adding to cart:', error);
        res.status(500).json({ error: error.message });
    }
};
exports.getCart = async (req, res) => {
  // Assuming userId is extracted from middleware or authentication

  try {
    const userid = req.userId;  
    const { data, error } = await supabase.rpc('cart_with_medicines', { userid });
      
      if (error) {
          console.error("Supabase RPC Error:", error.message);
          throw new Error("Failed to fetch cart items.");
      }

      res.status(200).json(data);
  } catch (error) {
      console.error("Server Error:", error.message);
      res.status(500).json({ error: error.message });
  }
};

  exports.clearCart = async (req, res) => {
    const userId = req.userId;
  
    try {
      await supabase.from('cart').delete().eq('user_id', userId);
      res.status(200).json({ message: 'Cart cleared.' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  exports.deleteCart = async (req, res) => {
    const { cartId, userId } = req.body; // Get cart_id and user_id from the request body
    
    // Log the cartId and userId to check if they are defined
    console.log('cartId:', cartId, 'userId:', userId);
  
    // Validate cartId and userId
    if (!cartId || !userId) {
      return res.status(400).json({ error: 'Missing cartId or userId in request body' });
    }
  
    try {
      // Delete the item from the cart where the cart_id matches and user_id is the same
      const { data, error } = await supabase
        .from('cart')
        .delete()
        .eq('cart_id', cartId)
        .eq('user_id', userId);
  
      if (error) {
        return res.status(500).json({ error: error.message });
      }
  
      // If no rows were deleted (data is empty), return a 404
    
      // If successful, return a success message
      res.status(200).json({ message: 'Cart item removed successfully.' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  
  
  exports.updateCart = async (req, res) => {
    const { cartId,userId,quantity } = req.body; // Get the new quantity from the request body
     // Assuming the user ID is stored in req.userId after JWT verification
  
    if (isNaN(quantity) || quantity < 1) {
      return res.status(400).json({ message: 'Invalid quantity.' });
    }
  
    try {
      // Update the quantity for the item in the cart where the cart_id and user_id match
      const { data, error } = await supabase
        .from('cart')
        .update({ quantity })
        .eq('cart_id', cartId)
        .eq('user_id', userId)
        .select();
  
      if (error) {
        return res.status(500).json({ error: error.message });
      }
  
      if (data.length === 0) {
        return res.status(404).json({ message: 'Cart item not found or not authorized to update.' });
      }
  
      res.status(200).json({
        message: 'Cart item updated successfully.',
        updatedItem: data[0], // Return the updated item details
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
    
  