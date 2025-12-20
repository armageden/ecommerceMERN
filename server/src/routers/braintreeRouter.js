const express = require('express');
const { isLoggedIn } = require('../middlewares/auth');
const { getToken, processPayment } = require('../controllers/braintreeController');
const router = express.Router();

router.get('/token', isLoggedIn, getToken);
router.post('/payment', isLoggedIn, processPayment);

module.exports = router;
