import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import moment from 'moment';
import { useAuth } from '../context/AuthContext';
import { Select } from 'antd';

const { Option } = Select;

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [status] = useState(['Not Processed', 'Processing', 'Shipped', 'Delivered', 'Cancelled']);
    const { auth } = useAuth();

    const getOrders = async () => {
        try {
            const { data } = await api.get('/orders/all-orders');
            setOrders(data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (auth?.token) getOrders();
    }, [auth?.token]);

    const handleStatusChange = async (orderId, value) => {
        try {
            const { data } = await api.put(`/orders/order-status/${orderId}`, {
                status: value,
            });
            getOrders();
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="admin-orders-container">
            <h2>Manage Orders</h2>
            {orders?.map((o, i) => (
                <div key={i} className="order-card">
                    <div className="order-header">
                        <span className="order-id">Order ID: {o._id}</span>
                        <span className="order-buyer">Buyer: {o.buyer?.name}</span>
                        <span className="order-date">{moment(o.createdAt).fromNow()}</span>
                    </div>
                    <div className="order-status-update">
                        <strong>Status: </strong>
                        <Select
                            bordered={false}
                            onChange={(value) => handleStatusChange(o._id, value)}
                            defaultValue={o.status}
                            style={{ width: 200, fontWeight: 'bold' }}
                        >
                            {status.map((s, i) => (
                                <Option key={i} value={s}>
                                    {s}
                                </Option>
                            ))}
                        </Select>
                    </div>
                    <div className="order-products">
                        {o.products?.map((p, j) => (
                            <div key={j} className="order-product-item">
                                <span>{p.product?.name}</span>
                                <span>{p.count} x ${p.price}</span>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default AdminOrders;
