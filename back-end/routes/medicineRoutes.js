const express = require('express');
const router = express.Router();
const medicinesController = require('../controller/medicineController');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const authenticateUser = require('../middleware/auth'); 


// Add a new medicine
router.post('/medicine', upload.single('image'),medicinesController.addMedicine);

// Edit an existing medicine
router.put('/:id', upload.single('image'), medicinesController.editMedicine);

// Delete a medicine
router.delete('/:id', medicinesController.deleteMedicine);

// Get details of a medicine
//router.get('/:id', medicineController.getMedicineDetails);



// Define route to get medicines by category
router.get('/category/:category', medicinesController.getMedicinesByCategory);
router.get('/medicine',medicinesController.getMedicines)
module.exports = router;
