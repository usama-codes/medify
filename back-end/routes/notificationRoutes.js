const express = require('express');
const  notificationController  = require('../controller/notificationController');
const authenticateUser = require('../middleware/auth'); 

const router = express.Router();


router.get('/:order_id',notificationController.fetchOrderNotification);
router.post('/setid',authenticateUser,notificationController.updatePharmacyId);
module.exports = router;
