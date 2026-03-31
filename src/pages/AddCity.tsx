import { useState } from 'react';
import type { City } from '../App';
import { TextField, Button } from '@mui/material';
import { Edit, Save, Close, Delete } from '@mui/icons-material';

interface AddCityProps {
    cities: City[];
    onAddCity: (city: City) => void;
    onUpdateCity: (id: string, city: City) => void;
    onDeleteCity: (id: string) => void;
}

export default function AddCity({ cities, onAddCity, onUpdateCity, onDeleteCity }: AddCityProps) {
    const [formData, setFormData] = useState({ name: '' });
    const [editingId, setEditingId] = useState<string | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name.trim()) return;

        if (editingId) {
            onUpdateCity(editingId, { id: editingId, name: formData.name });
            setEditingId(null);
        } else {
            onAddCity({ id: '', name: formData.name });
        }
        setFormData({ name: '' });
    };

    const handleEdit = (city: City) => {
        setFormData({ name: city.name });
        setEditingId(city.id);
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setFormData({ name: '' });
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">City Management</h2>

            <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-lg p-6 mb-6 shadow-sm">
                <div className="flex flex-col sm:flex-row gap-4">
                    <TextField
                        label="City Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ name: e.target.value })}
                        size="small"
                        required
                        fullWidth
                        sx={{ maxWidth: '400px' }}
                    />

                    <Button
                        type="submit"
                        variant="contained"
                        startIcon={<Save />}
                        sx={{ textTransform: 'none' }}
                    >
                        {editingId ? 'Update City' : 'Add City'}
                    </Button>

                    {editingId && (
                        <Button onClick={handleCancelEdit} variant="outlined" sx={{ minWidth: '40px', padding: '6px' }}>
                            <Close />
                        </Button>
                    )}
                </div>
            </form>

            <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold">Saved Cities</h3>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 w-2/3">City Name</th>
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 w-1/3">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {cities.length === 0 ? (
                                <tr>
                                    <td colSpan={2} className="px-6 py-8 text-center text-gray-500">
                                        No cities added yet
                                    </td>
                                </tr>
                            ) : (
                                cities.map((city) => (
                                    <tr key={city.id} className={`hover:bg-gray-50 ${editingId === city.id ? 'bg-blue-50' : ''}`}>
                                        <td className="px-6 py-4 text-sm text-gray-900">{city.name}</td>
                                        <td className="px-6 py-4 flex gap-2">
                                            <Button
                                                onClick={() => handleEdit(city)}
                                                size="small"
                                                startIcon={<Edit />}
                                                sx={{ textTransform: 'none' }}
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                onClick={() => onDeleteCity(city.id)}
                                                size="small"
                                                color="error"
                                                startIcon={<Delete />}
                                                sx={{ textTransform: 'none' }}
                                            >
                                                Delete
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
