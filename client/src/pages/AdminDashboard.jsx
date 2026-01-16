import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const AdminDashboard = () => {
    const { user } = useAuth();
    const location = useLocation();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    const isMainDashboard = location.pathname === '/admin/dashboard';

    useEffect(() => {
        if (isMainDashboard) {
            fetchAnalytics();
        }
    }, [isMainDashboard]);

    const fetchAnalytics = async () => {
        try {
            const { data } = await api.get('/analytics/dashboard');
            setStats(data);
        } catch (error) {
            console.error('Error fetching analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    const StatCard = ({ title, value, icon, color }) => (
        <div className="stat-card" style={{ borderLeftColor: color }}>
            <div className="stat-icon" style={{ background: color }}>{icon}</div>
            <div className="stat-info">
                <h4>{title}</h4>
                <p className="stat-value">{value}</p>
            </div>
        </div>
    );

    const renderAnalytics = () => {
        if (loading) return <div className="loading">Loading analytics...</div>;
        if (!stats) return <p>Unable to load analytics</p>;

        return (
            <div className="analytics-container">
                <h3>Overview</h3>
                <div className="stats-grid">
                    <StatCard title="Total Revenue" value={`$${stats.stats.totalRevenue}`} icon="💰" color="#10b981" />
                    <StatCard title="Total Orders" value={stats.stats.totalOrders} icon="📦" color="#6366f1" />
                    <StatCard title="Total Users" value={stats.stats.totalUsers} icon="👥" color="#f59e0b" />
                    <StatCard title="Total Products" value={stats.stats.totalProducts} icon="🛍️" color="#ef4444" />
                </div>

                <div className="analytics-row">
                    <div className="analytics-card">
                        <h4>Order Status</h4>
                        <div className="status-list">
                            {stats.orderStatusCounts.map((s) => (
                                <div key={s._id} className="status-item">
                                    <span className={`status-badge status-${s._id?.toLowerCase().replace(' ', '-')}`}>
                                        {s._id || 'Unknown'}
                                    </span>
                                    <span className="status-count">{s.count}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="analytics-card">
                        <h4>Sales (Last 7 Days)</h4>
                        <div className="mini-chart">
                            {stats.salesByDay.map((day) => (
                                <div key={day._id} className="chart-bar-container">
                                    <div
                                        className="chart-bar"
                                        style={{
                                            height: `${Math.max(20, (day.revenue / Math.max(...stats.salesByDay.map(d => d.revenue))) * 100)}%`
                                        }}
                                    >
                                        <span className="bar-value">${day.revenue.toFixed(0)}</span>
                                    </div>
                                    <span className="chart-label">{day._id.slice(-5)}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="analytics-row">
                    <div className="analytics-card full-width">
                        <h4>Top Selling Products</h4>
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>Units Sold</th>
                                    <th>Revenue</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats.topProducts.map((p) => (
                                    <tr key={p._id}>
                                        <td>{p.productDetails?.name || 'Unknown Product'}</td>
                                        <td>{p.totalSold}</td>
                                        <td>${p.revenue.toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="analytics-card">
                    <h4>Recent Orders</h4>
                    {stats.recentOrders.length === 0 ? (
                        <p>No recent orders</p>
                    ) : (
                        <ul className="recent-orders-list">
                            {stats.recentOrders.map((order) => (
                                <li key={order._id}>
                                    <span className="order-id">#{order._id.slice(-6)}</span>
                                    <span className="order-buyer">{order.buyer?.name || 'Guest'}</span>
                                    <span className={`status-badge status-${order.status?.toLowerCase().replace(' ', '-')}`}>
                                        {order.status}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="dashboard-container">
            <aside className="dashboard-sidebar">
                <h3>Admin Panel</h3>
                <ul>
                    <li><Link to="/admin/dashboard">📊 Dashboard</Link></li>
                    <li><Link to="/admin/dashboard/orders">📦 Orders</Link></li>
                    <li><Link to="/admin/dashboard/products">🛍️ Products</Link></li>
                    <li><Link to="/admin/dashboard/categories">📁 Categories</Link></li>
                    <li><Link to="/admin/dashboard/users">👥 Users</Link></li>
                </ul>
            </aside>
            <main className="dashboard-content">
                {isMainDashboard ? (
                    <>
                        <h2>Admin Dashboard</h2>
                        <p>Welcome back, Admin <strong>{user?.name}</strong></p>
                        {renderAnalytics()}
                    </>
                ) : (
                    <Outlet />
                )}
            </main>
        </div>
    );
};

export default AdminDashboard;

