const express = require('express');
const { isLoggedIn } = require('../middlewares/auth');
const { getWishlist, addToWishlist, removeFromWishlist } = require('../controllers/wishlistController');
const router = express.Router();

router.get('/', isLoggedIn, getWishlist);
router.post('/', isLoggedIn, addToWishlist);
router.delete('/:productId', isLoggedIn, removeFromWishlist);

module.exports = router;
