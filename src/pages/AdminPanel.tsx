import { useState, useEffect } from 'react';
import { TextField, Button, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import { Delete, PersonAdd } from '@mui/icons-material';
import { userService, type User } from '../services/userService';

export default function AdminPanel() {
    const [users, setUsers] = useState<User[]>([]);
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        role: 'admin'
    });

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            const data = await userService.getUsers();
            setUsers(data);
        } catch (error) {
            console.error('Failed to load users', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await userService.createUser(formData);
            alert('User created successfully');
            setFormData({ username: '', password: '', role: 'admin' });
            loadUsers();
        } catch (error: any) {
            console.error(error);
            alert(error.response?.data?.error || 'Failed to create user. Make sure username is unique.');
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Delete this user?')) return;
        try {
            await userService.deleteUser(id);
            loadUsers();
        } catch (error) {
            console.error(error);
            alert('Failed to delete user');
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>

            {/* Form */}
            <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-lg p-6 mb-6 shadow-sm max-w-2xl">
                <h3 className="text-lg font-semibold mb-4">Create New Administrator</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <TextField
                        label="Username"
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        size="small"
                        required
                    />

                    <TextField
                        label="Password"
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        size="small"
                        required
                    />

                    <FormControl size="small" required>
                        <InputLabel>Role</InputLabel>
                        <Select
                            value={formData.role}
                            label="Role"
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        >
                            <MenuItem value="admin">Admin</MenuItem>
                            <MenuItem value="viewer">Viewer</MenuItem>
                        </Select>
                    </FormControl>

                    <Button
                        type="submit"
                        variant="contained"
                        startIcon={<PersonAdd />}
                        sx={{ textTransform: 'none' }}
                    >
                        Create User
                    </Button>
                </div>
            </form>

            {/* Table */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden max-w-4xl">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold">System Users</h3>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Username</th>
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Role</th>
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Created At</th>
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-sm text-gray-900 font-semibold">{user.username}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{user.role}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <Button
                                            onClick={() => handleDelete(user.id)}
                                            size="small"
                                            color="error"
                                            startIcon={<Delete />}
                                            sx={{ textTransform: 'none' }}
                                        >
                                            Delete
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                            {users.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                                        No users found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
