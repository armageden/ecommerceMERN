const Product = require('../models/productModel');

const addReview = async (req, res) => {
    try {
        const { productId } = req.params;
        const { rating, comment } = req.body;

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Check if user already reviewed
        const alreadyReviewed = product.reviews.find(
            (r) => r.user.toString() === req.user._id.toString()
        );

        if (alreadyReviewed) {
            return res.status(400).json({ error: 'You have already reviewed this product' });
        }

        const review = {
            user: req.user._id,
            name: req.user.name,
            rating: Number(rating),
            comment,
        };

        product.reviews.push(review);
        product.numReviews = product.reviews.length;
        product.averageRating =
            product.reviews.reduce((acc, item) => item.rating + acc, 0) /
            product.reviews.length;

        await product.save();

        res.status(201).json({ message: 'Review added successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error adding review' });
    }
};

const getProductReviews = async (req, res) => {
    try {
        const { productId } = req.params;
        const product = await Product.findById(productId).select('reviews numReviews averageRating');

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.json({
            reviews: product.reviews,
            numReviews: product.numReviews,
            averageRating: product.averageRating,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching reviews' });
    }
};

module.exports = { addReview, getProductReviews };
