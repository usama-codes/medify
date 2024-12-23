const express = require('express');
const ordersController = require('../../admin/controller/orderController');
const notificationsController = require('../../admin/controller/notificationController');
const shipmentsController = require('../../admin/controller/shipmentController');
const medicineController=require('../../admin/controller/medicineController')
const router = express.Router();
const usersController=require('../../admin/controller/userController')
const pharmacyController=require('../../admin/controller/pharmacyController')
const customerController=require('../../admin/controller/customerController')

// Orders routes
router.get('/orders/:status', ordersController.getOrders);
router.put('/orders/:id', ordersController.updateOrderStatus);
router.post('/orders', ordersController.createOrder); // Add order
router.delete('/orders/:id', ordersController.deleteOrder); // Delete order

// Notifications routes
router.get('/notifications', notificationsController.getNotifications);
router.put('/notifications/:id', notificationsController.markAsRead);
router.post('/notifications', notificationsController.createNotification); // Add notification
router.delete('/notifications/:id', notificationsController.deleteNotification); // Delete notification

// Shipments routes
router.get('/shipments', shipmentsController.getShipments);
router.put('/shipments/:id', shipmentsController.updateShipmentStatus);
router.post('/shipments', shipmentsController.createShipment); // Add shipment
router.delete('/shipments/:id', shipmentsController.deleteShipment); // Delete shipment
router.get('/customer/summary',customerController.getSummary)


// Users routes
router.get('/users', usersController.getUsers);
router.post('/users', usersController.createUser);
router.put('/users/:id', usersController.updateUser);
router.delete('/users/:id', usersController.deleteUser);

// Customers routes
router.get('/customers', customerController.getCustomers);
router.post('/customers',  customerController.createCustomers);
router.put('/customers/:customer_id', customerController.updateCustomers);
router.delete('/customers/:id', customerController.deleteCustomers);
// Pharmacies routes
router.get('/pharmacies', pharmacyController.getPharmacies);
router.post('/pharmacies', pharmacyController.createPharmacies);
router.put('/pharmacies/:pharmacy_id', pharmacyController.updatePharmacies);
router.delete('/pharmacies/:id',pharmacyController.deletePharmacies);
router.get('/top_pharmacy',pharmacyController.gettopPharmacies)



router.get('/medicine', medicineController.getAllMedicines);
// Get a single medicine by ID
router.get('/:id', medicineController.getMedicineById);
// Add a new medicine
router.post('/new', medicineController.addMedicine);
// Update a medicine
router.put('/:id', medicineController.updateMedicine);
// Delete a medicine
router.delete('/:id', medicineController.deleteMedicine);
// Get medicines by category
router.get('/category/:category', medicineController.getMedicinesByCategory);
// Get medicines that require a prescription
router.get('/prescription', medicineController.getPrescriptionMedicines);
// Update medicine stock
router.patch('/:id/stock', medicineController.updateMedicineStock);
router.get('/medicine/top_selling_products', medicineController.gettopProducts);

module.exports = router;
