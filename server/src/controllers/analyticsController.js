const Order = require('../models/orderModel');
const User = require('../models/usermodel');
const Product = require('../models/productModel');

/**
 * Get dashboard analytics for admin
 */
const getDashboardStats = async (req, res) => {
    try {
        // Get total counts
        const totalOrders = await Order.countDocuments();
        const totalUsers = await User.countDocuments({ isAdmin: { $ne: true } });
        const totalProducts = await Product.countDocuments();

        // Calculate total revenue
        const orders = await Order.find({});
        const totalRevenue = orders.reduce((acc, order) => {
            const orderTotal = order.products.reduce((sum, p) => sum + (p.price * p.count), 0);
            return acc + orderTotal;
        }, 0);

        // Get order status breakdown
        const orderStatusCounts = await Order.aggregate([
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]);

        // Get recent orders (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const recentOrders = await Order.find({ createdAt: { $gte: sevenDaysAgo } })
            .populate('buyer', 'name')
            .sort({ createdAt: -1 })
            .limit(5);

        // Get sales by day (last 7 days)
        const salesByDay = await Order.aggregate([
            { $match: { createdAt: { $gte: sevenDaysAgo } } },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                    count: { $sum: 1 },
                    revenue: {
                        $sum: {
                            $reduce: {
                                input: '$products',
                                initialValue: 0,
                                in: { $add: ['$$value', { $multiply: ['$$this.price', '$$this.count'] }] }
                            }
                        }
                    }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // Get top selling products
        const topProducts = await Order.aggregate([
            { $unwind: '$products' },
            {
                $group: {
                    _id: '$products.product',
                    totalSold: { $sum: '$products.count' },
                    revenue: { $sum: { $multiply: ['$products.price', '$products.count'] } }
                }
            },
            { $sort: { totalSold: -1 } },
            { $limit: 5 },
            {
                $lookup: {
                    from: 'products',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'productDetails'
                }
            },
            { $unwind: { path: '$productDetails', preserveNullAndEmptyArrays: true } }
        ]);

        res.json({
            stats: {
                totalOrders,
                totalUsers,
                totalProducts,
                totalRevenue: totalRevenue.toFixed(2)
            },
            orderStatusCounts,
            recentOrders,
            salesByDay,
            topProducts
        });
    } catch (error) {
        console.error('Analytics error:', error);
        res.status(500).json({ error: 'Error fetching analytics' });
    }
};

module.exports = { getDashboardStats };
