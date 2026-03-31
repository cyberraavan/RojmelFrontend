import { useState } from 'react';
import type { GoodsType } from '../App';
import { TextField, Button, Autocomplete } from '@mui/material';
import { Edit, Save, Close, Delete } from '@mui/icons-material';

interface AddGoodsTypeProps {
  goodsTypes: GoodsType[];
  onAddGoodsType: (goodsType: GoodsType) => void;
  onUpdateGoodsType: (id: string, goodsType: GoodsType) => void;
  onDeleteGoodsType: (id: string) => void;
}

export default function AddGoodsType({ goodsTypes, onAddGoodsType, onUpdateGoodsType, onDeleteGoodsType }: AddGoodsTypeProps) {
  const [formData, setFormData] = useState({
    name: '',
    notes: ''
  });

  const [editingId, setEditingId] = useState<string | null>(null);

  const generateId = () => {
    return `GDS-${Date.now()}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const goodsType: GoodsType = {
      id: editingId || generateId(),
      name: formData.name,
      notes: formData.notes
    };

    if (editingId) {
      onUpdateGoodsType(editingId, goodsType);
      setEditingId(null);
    } else {
      onAddGoodsType(goodsType);
    }

    // Reset form
    setFormData({
      name: '',
      notes: ''
    });
  };

  const handleEdit = (goodsType: GoodsType) => {
    setFormData({
      name: goodsType.name,
      notes: goodsType.notes
    });
    setEditingId(goodsType.id);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({
      name: '',
      notes: ''
    });
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Add Goods Type</h2>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-lg p-6 mb-6 shadow-sm">
        <div className="space-y-4">
          <Autocomplete
            options={goodsTypes.map(g => g.name)}
            value={formData.name}
            onChange={(_, value) => setFormData({ ...formData, name: typeof value === 'string' ? value : value || '' })}
            onInputChange={(_, newInputValue) => setFormData({ ...formData, name: newInputValue })}
            freeSolo
            renderInput={(params) => (
              <TextField {...params} label="Goods Name" required />
            )}
          />

          <TextField
            label="Notes"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            multiline
            rows={3}
            fullWidth
          />

          <div className="flex gap-2">
            <Button
              type="submit"
              variant="contained"
              startIcon={<Save />}
              sx={{ textTransform: 'none' }}
            >
              {editingId ? 'Update Goods Type' : 'Save Goods Type'}
            </Button>
            {editingId && (
              <Button
                onClick={handleCancelEdit}
                variant="outlined"
                startIcon={<Close />}
                sx={{ textTransform: 'none' }}
              >
                Cancel
              </Button>
            )}
          </div>
        </div>
      </form>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold">All Goods Types</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Goods Name</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Notes</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Edit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {goodsTypes.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                    No goods types added yet
                  </td>
                </tr>
              ) : (
                goodsTypes.map((goodsType) => (
                  <tr key={goodsType.id} className={`hover:bg-gray-50 ${editingId === goodsType.id ? 'bg-blue-50' : ''}`}>
                    <td className="px-6 py-4 text-sm text-gray-900">{goodsType.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{goodsType.notes}</td>
                    <td className="px-6 py-4 flex gap-2">
                      <Button
                        onClick={() => handleEdit(goodsType)}
                        size="small"
                        startIcon={<Edit />}
                        sx={{ textTransform: 'none' }}
                      >
                        Edit
                      </Button>
                      <Button
                        onClick={() => onDeleteGoodsType(goodsType.id)}
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
