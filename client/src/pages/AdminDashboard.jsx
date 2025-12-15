import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
    const { user } = useAuth();

    return (
        <div className="dashboard-container">
            <aside className="dashboard-sidebar">
                <h3>Admin Panel</h3>
                <ul>
                    <li><Link to="/admin/dashboard/users">Manage Users</Link></li>
                    <li><Link to="/admin/dashboard/categories">Manage Categories</Link></li>
                    <li><Link to="/admin/dashboard/products">Manage Products</Link></li>
                </ul>
            </aside>
            <main className="dashboard-content">
                <h2>Admin Dashboard</h2>
                <p>Welcome back, Admin {user?.name}</p>
                <Outlet />
            </main>
        </div>
    );
};

export default AdminDashboard;
