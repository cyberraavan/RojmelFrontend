
import { useState } from 'react';
import type { Party } from '../App';
import { TextField, Button } from '@mui/material';
import { Edit, Save, Close, Delete } from '@mui/icons-material';

interface AddPartyProps {
  parties: Party[];
  onAddParty: (party: Party) => void;
  onUpdateParty: (id: string, party: Party) => void;
  onDeleteParty: (id: string) => void;
}

export default function AddParty({ parties, onAddParty, onUpdateParty, onDeleteParty }: AddPartyProps) {
  const [formData, setFormData] = useState({
    name: '',
    companyType: '',
    phone: '',
    address: '',
    description: ''
  });

  const [editingId, setEditingId] = useState<string | null>(null);

  const generateId = () => {
    return `PTY-${Date.now()}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const party: Party = {
      id: editingId || generateId(),
      name: formData.name,
      companyType: formData.companyType,
      phone: formData.phone,
      address: formData.address,
      description: formData.description
    };

    if (editingId) {
      onUpdateParty(editingId, party);
      setEditingId(null);
    } else {
      onAddParty(party);
    }

    // Reset form
    setFormData({
      name: '',
      companyType: '',
      phone: '',
      address: '',
      description: ''
    });
  };

  const handleEdit = (party: Party) => {
    setFormData({
      name: party.name,
      companyType: party.companyType,
      phone: party.phone,
      address: party.address,
      description: party.description
    });
    setEditingId(party.id);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({
      name: '',
      companyType: '',
      phone: '',
      address: '',
      description: ''
    });
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Add Party</h2>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-lg p-6 mb-6 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <TextField
            label="Party Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            size="small"
            required
          />

          <TextField
            label="Company Type"
            value={formData.companyType}
            onChange={(e) => setFormData({ ...formData, companyType: e.target.value })}
            size="small"
            required
          />

          <TextField
            label="Phone Number"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            size="small"
            required
          />

          <TextField
            label="Address"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            size="small"
            required
          />

          <TextField
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
          <h3 className="text-lg font-semibold">All Parties</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Party Name</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Company Type</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Phone</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Address</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Description</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Edit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {parties.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    No parties added yet
                  </td>
                </tr>
              ) : (
                parties.map((party) => (
                  <tr key={party.id} className={`hover:bg-gray-50 ${editingId === party.id ? 'bg-blue-50' : ''}`}>
                    <td className="px-6 py-4 text-sm text-gray-900">{party.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{party.companyType}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{party.phone}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{party.address}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{party.description}</td>
                    <td className="px-6 py-4 flex gap-2">
                      <Button
                        onClick={() => handleEdit(party)}
                        size="small"
                        startIcon={<Edit />}
                        sx={{ textTransform: 'none' }}
                      >
                        Edit
                      </Button>
                      <Button
                        onClick={() => onDeleteParty(party.id)}
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
