const express = require('express');
const { isLoggedIn, isAdmin } = require('../middlewares/auth');
const { getDashboardStats } = require('../controllers/analyticsController');
const router = express.Router();

router.get('/dashboard', isLoggedIn, isAdmin, getDashboardStats);

module.exports = router;
