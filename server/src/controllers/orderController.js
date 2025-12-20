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

const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({})
            .populate('products.product', 'name price')
            .populate('buyer', 'name') // Populate buyer name
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching all orders' });
    }
};

const orderStatusController = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;
        const order = await Order.findByIdAndUpdate(
            orderId,
            { status },
            { new: true }
        );
        res.json(order);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error updating order status' });
    }
};

module.exports = { getOrders, getAllOrders, orderStatusController };
