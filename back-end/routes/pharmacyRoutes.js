const express = require('express');
const router = express.Router();
const pharmacyController = require('../controller/pharmacyController');
const authenticateUser = require('../middleware/auth'); 
// Routes
router.get('/top-selling-drug', authenticateUser,pharmacyController.getTodaysSellingDrug);
router.get('/top-selling-products',authenticateUser, pharmacyController.getTopSellingProductWithSales);
router.get('/complete-orders',authenticateUser, pharmacyController.getCompletedOrdersCount);
router.get('/top-customers',authenticateUser,pharmacyController.getTopCustomers);
router.get('/pending-orders',authenticateUser, pharmacyController.getPendingOrders);
router.get('/pending-count',authenticateUser, pharmacyController.getPendingOrderCount);
router.get('/monthly-revenue',authenticateUser, pharmacyController.getMonthlyRevenue);
router.get('/today-revenue',authenticateUser,pharmacyController.getTodaysRevenue);
router.get('/shipped-count',authenticateUser,pharmacyController.getShippedOrdersCount);
router.get('/cancelled-orders',authenticateUser,pharmacyController.getCancelledOrdersCount);
router.get('/total-orders',authenticateUser,pharmacyController.gettotalOrdersCount);
router.get('/revenue-comparison',authenticateUser,pharmacyController.getRevenueGrowthComparison);
router.get('/allorder',authenticateUser,pharmacyController.get_orders_status);
router.put('/edit/:order_id',pharmacyController.editOrder);
router.delete('/delete/:id',pharmacyController.deleteOrder);
module.exports = router;

    
   
 
    