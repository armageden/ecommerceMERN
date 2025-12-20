const Order = require('../models/orderModel');

const getOrders = async (req, res) => {
    try {
        const orders = await Order.find({ buyer: req.user._id })
            .populate('products.product', 'name price')
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching orders' });
    }
};

module.exports = { getOrders };
