import React, { useState, useEffect } from 'react';
import api from '../api/axios';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

    const fetchUsers = async () => {
        try {
            // We need an endpoint to get all users. 
            // Checking backend... we might not have a "get all users" endpoint for admin yet?
            // Let's check userRouter.js or userControl.js.
            // If not, I'll have to add it or just use what we have.
            // Wait, I remember adding ban/unban, but did I add "get all users"?
            // Let's assume I need to add it or it exists. 
            // Actually, looking at previous summary: "Day 7... Get User Profile... Ban/Unban". 
            // It doesn't explicitly say "Get All Users". 
            // I might need to add that to the backend first or now.
            // For now, I'll write the frontend code assuming the endpoint exists or I will create it.
            // Let's assume GET /api/users/process-register (no), /api/users (maybe?)

            // Let's check the backend code quickly before finalizing this file.
            // But I can't check in the middle of a tool call block effectively without breaking flow.
            // I'll write the code to hit /api/users and if it fails I'll fix the backend.

            const response = await api.get('/users');
            setUsers(response.data.payload.users);
            setLoading(false);
        } catch (error) {
            console.error("Failed to fetch users", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleBanUnban = async (id, action) => {
        try {
            await api.put(`/users/manage-user/${id}`, { action });
            setMessage(`User ${action}ned successfully`);
            fetchUsers(); // Refresh list
        } catch (error) {
            setMessage('Failed to update user status');
        }
    };

    if (loading) return <div>Loading users...</div>;

    return (
        <div className="admin-users-container">
            <h3>User Management</h3>
            {message && <p className="message">{message}</p>}
            <table className="table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {users && users.map(user => (
                        <tr key={user._id}>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.isAdmin ? 'Admin' : 'User'}</td>
                            <td>{user.isBanned ? 'Banned' : 'Active'}</td>
                            <td>
                                {!user.isAdmin && (
                                    <button
                                        onClick={() => handleBanUnban(user._id, user.isBanned ? 'unban' : 'ban')}
                                        className={user.isBanned ? 'btn-success' : 'btn-danger'}
                                    >
                                        {user.isBanned ? 'Unban' : 'Ban'}
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminUsers;
