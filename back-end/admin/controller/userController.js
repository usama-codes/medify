const {supabase} = require('../../config/dbconfig');

// Get all users
exports.getUsers = async (req, res) => {
    const { data, error } = await supabase.from('view_users').select('*');
    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
};

// Insert a user
exports.createUser = async (req, res) => {
    const userData = req.body;
    const { data, error } = await supabase.from('users').insert(userData).select();
    if (error) return res.status(400).json({ error: error.message });
    res.status(201).json(data);
};

// Update a user
exports.updateUser = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    const { error } = await supabase.from('users').update(updates).eq('user_id', id);
    if (error) return res.status(400).json({ error: error.message });
    res.json({ message: 'User updated successfully.' });
};

// Delete a user
exports.deleteUser = async (req, res) => {
    const { id } = req.params;
    const { error } = await supabase.from('users').delete().eq('user_id', id);
    if (error) return res.status(400).json({ error: error.message });
    res.json({ message: 'User deleted successfully.' });
};
