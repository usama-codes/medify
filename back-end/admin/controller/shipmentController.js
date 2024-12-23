const {supabase} = require('../../config/dbconfig');

// Get all shipments
exports.getShipments = async (req, res) => {
    const { data, error } = await supabase.from('view_shipments').select('*');
    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
};

// Update shipment status
exports.updateShipmentStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const { error } = await supabase
        .from('shipment')
        .update({ STATUS: status })
        .eq('shipment_id', id);
    if (error) return res.status(400).json({ error: error.message });
    res.json({ message: 'Shipment status updated successfully.' });
};

// Insert a new shipment
exports.createShipment = async (req, res) => {
    const shipmentData = req.body;
    const { data, error } = await supabase.from('shipment').insert(shipmentData).select();
    if (error) return res.status(400).json({ error: error.message });
    res.status(201).json(data);
};

// Delete a shipment
exports.deleteShipment = async (req, res) => {
    const { id } = req.params;
    const { error } = await supabase.from('shipment').delete().eq('shipment_id', id);
    if (error) return res.status(400).json({ error: error.message });
    res.json({ message: 'Shipment deleted successfully.' });
};
