const Order = require('../models/orderModel');
const User = require('../models/usermodel');
const { emailWithNodeMailer } = require('../helper/email');
const { orderStatusUpdateTemplate } = require('../helper/emailTemplates');

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
            .populate('buyer', 'name email')
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
        ).populate('buyer', 'name email');

        // Send status update email
        if (order && order.buyer && order.buyer.email) {
            try {
                const emailData = {
                    email: order.buyer.email,
                    subject: `Order Status Updated - ${status}`,
                    html: orderStatusUpdateTemplate(order, order.buyer, status)
                };
                await emailWithNodeMailer(emailData);
            } catch (emailError) {
                console.error('Error sending status update email:', emailError);
                // Don't fail the update if email fails
            }
        }

        res.json(order);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error updating order status' });
    }
};

module.exports = { getOrders, getAllOrders, orderStatusController };

