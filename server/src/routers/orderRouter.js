const express = require('express');
const { isLoggedIn, isAdmin } = require('../middlewares/auth');
const { getOrders, getAllOrders, orderStatusController } = require('../controllers/orderController');
const router = express.Router();

router.get('/', isLoggedIn, getOrders);
router.get('/all-orders', isLoggedIn, isAdmin, getAllOrders);
router.put('/order-status/:orderId', isLoggedIn, isAdmin, orderStatusController);

module.exports = router;
