const {supabase} = require('../../config/dbconfig');

// Get all medicines
exports.getAllMedicines = async (req, res) => {
    const { data, error } = await supabase.from('medicines').select('*');
    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
};

// Get a single medicine by ID
exports.getMedicineById = async (req, res) => {
    const { id } = req.params;
    const { data, error } = await supabase.from('medicines').select('*').eq('medicine_id', id).single();
    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
};

// Add a new medicine
exports.addMedicine = async (req, res) => {
    const { name, price, image_url, formula, category, require_prescription, stock } = req.body;
  
    try {
      const { data, error } = await supabase.from('medicines').insert([
        { name, price, image_url, formula, category, require_prescription, stock }
      ]).select();
  
      if (error) {
        console.error('Error adding medicine:', error.message);
        return res.status(400).json({ error: error.message });
      }
  
      res.status(201).json(data);
    } catch (err) {
      console.error('Unexpected error:', err);
      res.status(500).json({ error: 'An unexpected error occurred.' });
    }
  };
  
// Update a medicine
exports.updateMedicine = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
  
    try {
      const { error } = await supabase.from('medicines').update(updates).eq('medicine_id', id);
  
      if (error) {
        console.error('Error updating medicine:', error.message);
        return res.status(400).json({ error: error.message });
      }
  
      res.json({ message: 'Medicine updated successfully.' });
    } catch (err) {
      console.error('Unexpected error:', err);
      res.status(500).json({ error: 'An unexpected error occurred.' });
    }
  };
  exports.deleteMedicine = async (req, res) => {
    const { id } = req.params;
  
    try {
      const { error } = await supabase.from('medicines').delete().eq('medicine_id', id);
  
      if (error) {
        console.error('Error deleting medicine:', error.message);
        return res.status(400).json({ error: error.message });
      }
  
      res.json({ message: 'Medicine deleted successfully.' });
    } catch (err) {
      console.error('Unexpected error:', err);
      res.status(500).json({ error: 'An unexpected error occurred.' });
    }
  };
    

// Get medicines by category
exports.getMedicinesByCategory = async (req, res) => {
    const { category } = req.params;

    const { data, error } = await supabase.from('medicines').select('*').eq('category', category);
    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
};

// Get medicines that require a prescription
exports.getPrescriptionMedicines = async (req, res) => {
    const { data, error } = await supabase.from('medicines').select('*').eq('require_prescription', true);
    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
};

// Update stock for a specific medicine
exports.updateMedicineStock = async (req, res) => {
    const { id } = req.params;
    const { stock } = req.body;

    const { error } = await supabase.from('medicines').update({ STOCK: stock }).eq('medicine_id', id);
    if (error) return res.status(400).json({ error: error.message });
    res.json({ message: 'Medicine stock updated successfully.' });
};
exports.gettopProducts = async (req, res) => {
    const { data, error } = await supabase.from('view_top_selling_products').select('*');
    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
};


