const express = require('express');
const { isLoggedIn } = require('../middlewares/auth');
const { addReview, getProductReviews } = require('../controllers/reviewController');
const router = express.Router();

router.post('/:productId', isLoggedIn, addReview);
router.get('/:productId', getProductReviews);

module.exports = router;
