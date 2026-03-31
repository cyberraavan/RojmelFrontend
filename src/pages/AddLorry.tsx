import { useState } from 'react';
import type { Lorry } from '../App';
import { TextField, Button } from '@mui/material';
import { Edit, Save, Close, Delete } from '@mui/icons-material';

interface AddLorryProps {
  lorries: Lorry[];
  onAddLorry: (lorry: Lorry) => void;
  onUpdateLorry: (id: string, lorry: Lorry) => void;
  onDeleteLorry: (id: string) => void;
}

export default function AddLorry({ lorries, onAddLorry, onUpdateLorry, onDeleteLorry }: AddLorryProps) {
  const [formData, setFormData] = useState({
    numberPlate: '',
    ownerName: '',
    ownerPhone: '',
    capacity: '',
    notes: ''
  });

  const [editingId, setEditingId] = useState<string | null>(null);

  const generateId = () => {
    return `LRY-${Date.now()}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const lorry: Lorry = {
      id: editingId || generateId(),
      numberPlate: formData.numberPlate,
      ownerName: formData.ownerName,
      ownerPhone: formData.ownerPhone,
      capacity: formData.capacity,
      notes: formData.notes
    };

    if (editingId) {
      onUpdateLorry(editingId, lorry);
      setEditingId(null);
    } else {
      onAddLorry(lorry);
    }

    // Reset form
    setFormData({
      numberPlate: '',
      ownerName: '',
      ownerPhone: '',
      capacity: '',
      notes: ''
    });
  };

  const handleEdit = (lorry: Lorry) => {
    setFormData({
      numberPlate: lorry.numberPlate,
      ownerName: lorry.ownerName,
      ownerPhone: lorry.ownerPhone,
      capacity: lorry.capacity,
      notes: lorry.notes
    });
    setEditingId(lorry.id);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({
      numberPlate: '',
      ownerName: '',
      ownerPhone: '',
      capacity: '',
      notes: ''
    });
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Add Lorry</h2>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-lg p-6 mb-6 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <TextField
            label="Number Plate"
            value={formData.numberPlate}
            onChange={(e) => setFormData({ ...formData, numberPlate: e.target.value })}
            size="small"
            required
          />

          <TextField
            label="Owner Name"
            value={formData.ownerName}
            onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
            size="small"
            required
          />

          <TextField
            label="Owner Phone"
            value={formData.ownerPhone}
            onChange={(e) => setFormData({ ...formData, ownerPhone: e.target.value })}
            size="small"
            required
          />

          <TextField
            label="Vehicle Capacity"
            value={formData.capacity}
            onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
            size="small"
            placeholder="e.g., 10 tons"
            required
          />

          <TextField
            label="Notes"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            size="small"
          />

          <div className="flex gap-2">
            <Button
              type="submit"
              variant="contained"
              startIcon={<Save />}
              fullWidth
              sx={{ textTransform: 'none' }}
            >
              {editingId ? 'Update' : 'Save'}
            </Button>
            {editingId && (
              <Button
                onClick={handleCancelEdit}
                variant="outlined"
                sx={{ minWidth: '40px', padding: '6px' }}
              >
                <Close />
              </Button>
            )}
          </div>
        </div>
      </form>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold">All Vehicles</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Number Plate</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Owner</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Phone</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Capacity</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Notes</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Edit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {lorries.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    No vehicles added yet
                  </td>
                </tr>
              ) : (
                lorries.map((lorry) => (
                  <tr key={lorry.id} className={`hover:bg-gray-50 ${editingId === lorry.id ? 'bg-blue-50' : ''}`}>
                    <td className="px-6 py-4 text-sm text-gray-900">{lorry.numberPlate}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{lorry.ownerName}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{lorry.ownerPhone}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{lorry.capacity}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{lorry.notes}</td>
                    <td className="px-6 py-4 flex gap-2">
                      <Button
                        onClick={() => handleEdit(lorry)}
                        size="small"
                        startIcon={<Edit />}
                        sx={{ textTransform: 'none' }}
                      >
                        Edit
                      </Button>
                      <Button
                        onClick={() => onDeleteLorry(lorry.id)}
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
