import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
    const { user } = useAuth();

    return (
        <div className="dashboard-container">
            <aside className="dashboard-sidebar">
                <h3>User Dashboard</h3>
                <ul>
                    <li><Link to="/dashboard/profile">Profile</Link></li>
                    <li><Link to="/dashboard/orders">Orders</Link></li>
                </ul>
            </aside>
            <main className="dashboard-content">
                <h2>Welcome, {user?.name}</h2>
                <Outlet />
            </main>
        </div>
    );
};

export default Dashboard;
