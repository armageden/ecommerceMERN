const Wishlist = require('../models/wishlistModel');

// Get user's wishlist
const getWishlist = async (req, res) => {
    try {
        let wishlist = await Wishlist.findOne({ user: req.user._id })
            .populate('products', 'name slug price image');

        if (!wishlist) {
            wishlist = { products: [] };
        }

        res.json(wishlist);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching wishlist' });
    }
};

// Add product to wishlist
const addToWishlist = async (req, res) => {
    try {
        const { productId } = req.body;

        let wishlist = await Wishlist.findOne({ user: req.user._id });

        if (!wishlist) {
            wishlist = new Wishlist({ user: req.user._id, products: [] });
        }

        // Check if product already in wishlist
        if (wishlist.products.includes(productId)) {
            return res.status(400).json({ error: 'Product already in wishlist' });
        }

        wishlist.products.push(productId);
        await wishlist.save();

        res.json({ message: 'Product added to wishlist', wishlist });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error adding to wishlist' });
    }
};

// Remove product from wishlist
const removeFromWishlist = async (req, res) => {
    try {
        const { productId } = req.params;

        const wishlist = await Wishlist.findOne({ user: req.user._id });

        if (!wishlist) {
            return res.status(404).json({ error: 'Wishlist not found' });
        }

        wishlist.products = wishlist.products.filter(
            (p) => p.toString() !== productId
        );

        await wishlist.save();

        res.json({ message: 'Product removed from wishlist', wishlist });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error removing from wishlist' });
    }
};

module.exports = { getWishlist, addToWishlist, removeFromWishlist };
