const {supabase,supabaseUrl} = require('../config/dbconfig'); // Import Supabase client

exports.addMedicine = async (req, res) => {
    try {
        // Extract request body values
        const { name, price,  description, category } = req.body;

        // Check if file is uploaded and available
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        // Upload image to Supabase Storage
        const fileName = `/${Date.now()}-${req.file.originalname}`;
        const { data: storageData, error: storageError } = await supabase.storage
            .from('medicine_images/medicines')  // 'medicine-images' should be your Supabase storage bucket
            .upload(fileName, req.file.buffer, { contentType: req.file.mimetype });

        if (storageError) {
            console.error("Error uploading image:", storageError);  // Log the storage error
            return res.status(500).json({ error: storageError.message }); // Return error response
        }

        // Construct image URL from Supabase Storage
        const imageUrl = `${supabaseUrl}/storage/v1/object/public/${storageData.path}`;

        // Insert medicine into the database
        const { data: dbData, error: dbError } = await supabase.from('medicines').insert({
            name: name,
            price: parseFloat(price),
            image_url: imageUrl,
            category: category,
            description: description || null,
            
        });

        if (dbError) {
            console.error("Error inserting into database:", dbError);  // Log the database error
            return res.status(500).json({ error: dbError.message });  // Return error response
        }

        console.log("Medicine added successfully:", dbData);  // Log the success response
        res.status(201).json({ message: 'Medicine added successfully', medicine: dbData });

    } catch (error) {
        console.error("Error in addMedicine function:", error.message);  // Log any unexpected errors
        res.status(500).json({ error: error.message });
    }
};
// editMedicine function to update medicine details
exports.editMedicine = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, price, formula, category, require_prescription, stock } = req.body;

        let imageUrl;
        if (req.file) {
            // Upload new image to Supabase Storage
            const fileName = `/${Date.now()}-${req.file.originalname}`;
            const { data: storageData, error: storageError } = await supabase.storage
                .from('medicine_images')
                .upload(fileName, req.file.buffer, { contentType: req.file.mimetype });

            if (storageError) throw new Error(storageError.message);
            imageUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/${storageData.path}`;
        }

        // Update medicine in the database
        const { data, error } = await supabase.from('medicines').update({
            name, // Column names in lowercase
            price: parseFloat(price),
            image_url: imageUrl || undefined, // Ensure column names are lowercase
            category,
        }).eq('medicine_id', id);  // Use lowercase 'medicine_id'

        if (error) throw new Error(error.message);

        res.json({ message: 'Medicine updated successfully', data });
    } catch (error) {
        console.error('Error updating medicine:', error.message); // Log the error message for debugging
        res.status(500).json({ error: error.message });
    }
};

// deleteMedicine function to remove a medicine from the database and storage
exports.deleteMedicine = async (req, res) => {
    try {
        const { id } = req.params;

        // Fetch the medicine to get the image URL
        const { data: medicine, error: fetchError } = await supabase
            .from('medicines')
            .select('image_url')  // Ensure 'image_url' is correct
            .eq('medicine_id', id)
            .single();

        // Debugging: Log the medicine data
        console.log(medicine);

        if (fetchError || !medicine) throw new Error('Medicine not found');

        // Ensure image_url exists
        if (!medicine.image_url) {
            throw new Error('Image URL is missing for the medicine');
        }

        // Delete image from Supabase Storage
        const imagePath = medicine.image_url.split('/storage/v1/object/public/')[1];

        const { data: removeData, error: removeError } = await supabase.storage
            .from('medicine_images')
            .remove([imagePath]);

        if (removeError) {
            console.error('Error removing image from Supabase Storage:', removeError);
            throw new Error('Error removing image from Supabase Storage');
        } else {
            console.log('Image successfully removed:', removeData);
        }

        // Delete medicine from the database
        const { error: deleteError } = await supabase.from('medicines').delete().eq('medicine_id', id);
        if (deleteError) throw new Error(deleteError.message);

        res.json({ message: 'Medicine deleted successfully' });
    } catch (error) {
        console.error('Error deleting medicine:', error.message); // Add more detailed error logging
        res.status(500).json({ error: error.message });
    }
};


exports.getMedicinesByCategory = async (req, res) => {
    const { category } = req.params;

    try {
        // Fetch medicines filtered by category
        const { data: medicines, error } = await supabase
            .from('medicines')
            .select('*')
            .eq('category', category);

        if (error) throw new Error(error.message);

        if (!medicines || medicines.length === 0) {
            return res.status(404).json({ message: 'No medicine found in this category' });
        }

        res.status(200).json({ medicines });
    } catch (error) {
        console.error('Error fetching medicines by category:', error);
        res.status(500).json({ error: error.message });
    }
};
exports.getMedicines = async (req, res) => {
  
    try {
        // Fetch medicines filtered by category
        const { data: medicines, error } = await supabase
            .from('medicines')
            .select('*')
  
        if (error) throw new Error(error.message);

        if (!medicines || medicines.length === 0) {
            return res.status(404).json({ message: 'No medicine found in this category' });
        }

        res.status(200).json({ medicines });
    } catch (error) {
        console.error('Error fetching medicines by category:', error);
        res.status(500).json({ error: error.message });
    }
};
