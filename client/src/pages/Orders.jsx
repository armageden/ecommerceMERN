import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import moment from 'moment';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const { data } = await api.get('/orders');
                setOrders(data);
            } catch (error) {
                console.error('Error fetching orders:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    if (loading) return <div className="loading">Loading orders...</div>;

    return (
        <div className="orders-container">
            <h2>Your Orders</h2>
            {orders.length === 0 ? (
                <p>No orders found.</p>
            ) : (
                <div className="orders-list">
                    {orders.map((order) => (
                        <div key={order._id} className="order-card">
                            <div className="order-header">
                                <span className="order-id">Order ID: {order._id}</span>
                                <span className={`order-status status-${order.status.toLowerCase().replace(' ', '-')}`}>
                                    {order.status}
                                </span>
                            </div>
                            <div className="order-date">
                                Placed on: {moment(order.createdAt).format('MMMM Do YYYY, h:mm:ss a')}
                            </div>
                            <div className="order-products">
                                {order.products.map((p, i) => (
                                    <div key={i} className="order-product-item">
                                        <span className="product-name">{p.product?.name || 'Unknown Product'}</span>
                                        <span className="product-quantity">x {p.count}</span>
                                        <span className="product-price">${p.price}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="order-total">
                                <strong>Total: ${order.payment?.transaction?.amount || '0.00'}</strong>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Orders;
