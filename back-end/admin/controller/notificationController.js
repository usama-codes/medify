const {supabase} = require('../../config/dbconfig');

// Get all notifications
exports.getNotifications = async (req, res) => {
    const { data, error } = await supabase.from('view_notifications').select('*');
    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
};

// Mark notification as read
exports.markAsRead = async (req, res) => {
    const { id } = req.params;
    const { error } = await supabase
        .from('notification')
        .update({ IS_READ: true })
        .eq('notification_id', id);
    if (error) return res.status(400).json({ error: error.message });
    res.json({ message: 'Notification marked as read.' });
};

// Insert a new notification
exports.createNotification = async (req, res) => {
    const notificationData = req.body;
    const { data, error } = await supabase.from('notification').insert(notificationData).select();
    if (error) return res.status(400).json({ error: error.message });
    res.status(201).json(data);
};

// Delete a notification
exports.deleteNotification = async (req, res) => {
    const { id } = req.params;
    const { error } = await supabase.from('notification').delete().eq('notification_id', id);
    if (error) return res.status(400).json({ error: error.message });
    res.json({ message: 'Notification deleted successfully.' });
};
