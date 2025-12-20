const express = require('express');
const { isLoggedIn } = require('../middlewares/auth');
const { getOrders } = require('../controllers/orderController');
const router = express.Router();

router.get('/', isLoggedIn, getOrders);

module.exports = router;
