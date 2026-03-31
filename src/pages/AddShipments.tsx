import { useState } from 'react';
import type { Shipment, Party, GoodsType, Lorry, City } from '../App';
import { TextField, Autocomplete, Button, Select, MenuItem, FormControl, InputLabel, RadioGroup, FormControlLabel, Radio, InputAdornment } from '@mui/material';
import { Edit, Save, Close } from '@mui/icons-material';

interface AddShipmentsProps {
  shipments: Shipment[];
  parties: Party[];
  goodsTypes: GoodsType[];
  lorries: Lorry[];
  cities: City[];
  onAddShipment: (shipment: Shipment) => void;
  onUpdateShipment: (id: string, shipment: Shipment) => void;
}

export default function AddShipments({
  shipments,
  parties,
  goodsTypes,
  lorries,
  cities,
  onAddShipment,
  onUpdateShipment
}: AddShipmentsProps) {
  const getLocalToday = () => {
    const d = new Date();
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().split('T')[0];
  };
  const today = getLocalToday();

  const [formData, setFormData] = useState({
    date: today,
    partyName: '',
    goodsType: '',
    size: '',
    weight: '',
    weightUnit: 'KG',
    price: '',
    priceType: 'TOTAL',
    pricePerKg: '',
    deliveryCity: '',
    deliveryType: 'DD',
    vehicle: '',
    notes: ''
  });

  const [editingId, setEditingId] = useState<string | null>(null);

  const generateShipmentId = () => {
    const date = new Date();
    const timestamp = date.getTime();
    return `SHP-${timestamp}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const shipment: Shipment = {
      id: editingId || generateShipmentId(),
      date: formData.date,
      partyName: formData.partyName,
      goodsType: formData.goodsType,
      size: formData.size,
      weight: formData.weight,
      weightUnit: formData.weightUnit,
      price: parseFloat(formData.price) || 0,
      priceType: formData.priceType,
      pricePerKg: formData.pricePerKg ? parseFloat(formData.pricePerKg) : null,
      deliveryCity: formData.deliveryCity,
      deliveryType: formData.deliveryType,
      vehicle: formData.vehicle,
      notes: formData.notes
    };

    if (editingId) {
      onUpdateShipment(editingId, shipment);
      setEditingId(null);
    } else {
      onAddShipment(shipment);
    }

    // Reset form
    setFormData({
      date: today,
      partyName: '',
      goodsType: '',
      size: '',
      weight: '',
      weightUnit: 'KG',
      price: '',
      priceType: 'TOTAL',
      pricePerKg: '',
      deliveryCity: '',
      deliveryType: 'DD',
      vehicle: '',
      notes: ''
    });
  };

  const handleEdit = (shipment: Shipment) => {
    setFormData({
      date: shipment.date,
      partyName: shipment.partyName,
      goodsType: shipment.goodsType,
      size: shipment.size,
      weight: shipment.weight,
      weightUnit: shipment.weightUnit || 'KG',
      price: shipment.price.toString(),
      priceType: shipment.priceType || 'TOTAL',
      pricePerKg: shipment.pricePerKg ? shipment.pricePerKg.toString() : '',
      deliveryCity: shipment.deliveryCity,
      deliveryType: shipment.deliveryType || 'DD',
      vehicle: shipment.vehicle,
      notes: shipment.notes
    });
    setEditingId(shipment.id);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({
      date: today,
      partyName: '',
      goodsType: '',
      size: '',
      weight: '',
      weightUnit: 'KG',
      price: '',
      priceType: 'TOTAL',
      pricePerKg: '',
      deliveryCity: '',
      deliveryType: 'DD',
      vehicle: '',
      notes: ''
    });
  };

  const todayShipments = shipments.filter(s => s.date === today);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Add Shipments</h2>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-lg p-6 mb-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
          <TextField
            label="Date"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            size="small"
            required
            InputLabelProps={{ shrink: true }}
          />
          <Autocomplete
            options={cities.map(c => c.name)}
            value={formData.deliveryCity}
            onChange={(_, value) => setFormData({ ...formData, deliveryCity: typeof value === 'string' ? value : value || '' })}
            onInputChange={(_, newInputValue) => setFormData({ ...formData, deliveryCity: newInputValue })}
            freeSolo
            renderInput={(params) => (
              <TextField {...params} label="Delivery City" size="small" required />
            )}
          />
          <Autocomplete
            options={parties.map(p => p.name)}
            value={formData.partyName}
            onChange={(_, value) => setFormData({ ...formData, partyName: typeof value === 'string' ? value : value || '' })}
            onInputChange={(_, newInputValue) => setFormData({ ...formData, partyName: newInputValue })}
            freeSolo
            renderInput={(params) => (
              <TextField {...params} label="Party Name" size="small" required />
            )}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
          <Autocomplete
            options={goodsTypes.map(g => g.name)}
            value={formData.goodsType}
            onChange={(_, value) => setFormData({ ...formData, goodsType: typeof value === 'string' ? value : value || '' })}
            onInputChange={(_, newInputValue) => setFormData({ ...formData, goodsType: newInputValue })}
            freeSolo
            renderInput={(params) => (
              <TextField {...params} label="Goods Type" size="small" required />
            )}
          />

          <Autocomplete
            options={formData.goodsType === 'Power Press' ? ['10 TON', '20 TON', '30 TON', '40 TON', '50 TON', '60 TON', '80 TON', '100 TON'] :
              formData.goodsType === 'Lathe Machine' ? ['4.5 FEET', '5.5 FEET', '6 FEET', '7 FEET', '9 FEET', '10 FEET', '12 FEET', '16 FEET', '18 FEET', '20 FEET', '24 FEET'] : []}
            value={formData.size}
            onChange={(_, value) => setFormData({ ...formData, size: typeof value === 'string' ? value : value || '' })}
            onInputChange={(_, newInputValue) => setFormData({ ...formData, size: newInputValue })}
            freeSolo
            renderInput={(params) => (
              <TextField {...params} label="Size of Goods" size="small" required placeholder="e.g., 7x3" />
            )}
          />

          <div className="flex gap-2">
            <TextField
              label="Weight"
              value={formData.weight}
              onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
              size="small"
              placeholder="e.g., 500"
              required
              fullWidth
            />
            <FormControl size="small" sx={{ minWidth: 80 }}>
              <InputLabel id="weight-unit-label">Unit</InputLabel>
              <Select
                labelId="weight-unit-label"
                value={formData.weightUnit}
                label="Unit"
                onChange={(e) => setFormData({ ...formData, weightUnit: e.target.value })}
              >
                <MenuItem value="KG">KG</MenuItem>
                <MenuItem value="TON">TON</MenuItem>
              </Select>
            </FormControl>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
          <FormControl component="fieldset" size="small">
            <RadioGroup
              row
              value={formData.priceType}
              onChange={(e) => setFormData({ ...formData, priceType: e.target.value })}
            >
              <FormControlLabel value="TOTAL" control={<Radio size="small" />} label={<span className="text-xs">Overall</span>} />
              <FormControlLabel value="PER_KG" control={<Radio size="small" />} label={<span className="text-xs">Per KG</span>} />
              <FormControlLabel value="BOTH" control={<Radio size="small" />} label={<span className="text-xs">Both</span>} />
            </RadioGroup>
          </FormControl>

          <div className="flex flex-col sm:flex-row gap-2 col-span-1 md:col-span-2">
            {(formData.priceType === 'PER_KG' || formData.priceType === 'BOTH') && (
              <TextField
                label="Price Per KG"
                type="number"
                value={formData.pricePerKg}
                onChange={(e) => {
                  const val = e.target.value;
                  let total = formData.price;
                  if (val && formData.weight) {
                    const weightNum = parseFloat(formData.weight);
                    const perKg = parseFloat(val);
                    if (!isNaN(weightNum) && !isNaN(perKg)) {
                      const multiplier = formData.weightUnit === 'TON' ? 1000 : 1;
                      total = (weightNum * multiplier * perKg).toString();
                    }
                  }
                  setFormData({ ...formData, pricePerKg: val, price: total });
                }}
                size="small"
                required
                InputProps={{
                  startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                }}
                fullWidth
              />
            )}

            {(formData.priceType === 'TOTAL' || formData.priceType === 'BOTH') && (
              <TextField
                label="Total Price"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                size="small"
                required
                InputProps={{
                  startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                }}
                fullWidth
              />
            )}

            {formData.priceType === 'PER_KG' && (
              <TextField
                label="Calc Total"
                value={formData.price}
                size="small"
                disabled
                InputProps={{
                  startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                }}
                fullWidth
              />
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
          <FormControl component="fieldset" size="small" className="col-span-1">
            <RadioGroup
              row
              value={formData.deliveryType}
              onChange={(e) => setFormData({ ...formData, deliveryType: e.target.value })}
            >
              <FormControlLabel value="DD" control={<Radio size="small" />} label={<span className="text-xs">DD</span>} />
              <FormControlLabel value="GG" control={<Radio size="small" />} label={<span className="text-xs">GG</span>} />
              <FormControlLabel value="DG" control={<Radio size="small" />} label={<span className="text-xs">DG</span>} />
              <FormControlLabel value="GD" control={<Radio size="small" />} label={<span className="text-xs">GD</span>} />
            </RadioGroup>
          </FormControl>


          <Autocomplete
            options={lorries.map(l => l.numberPlate)}
            value={formData.vehicle}
            onChange={(_, value) => setFormData({ ...formData, vehicle: typeof value === 'string' ? value : value || '' })}
            onInputChange={(_, newInputValue) => setFormData({ ...formData, vehicle: newInputValue })}
            freeSolo
            renderInput={(params) => (
              <TextField {...params} label="Loading Vehicle" size="small" required />
            )}
          />

          <TextField
            label="Extra Notes"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            size="small"
            multiline
          />

          <div className="flex gap-2">
            <Button
              type="submit"
              variant="contained"
              startIcon={<Save />}
              fullWidth
              sx={{ textTransform: 'none' }}
            >
              {editingId ? 'Update' : 'Save'} Shipment
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
          <h3 className="text-lg font-semibold">Today's Shipment Logs</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Party</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Goods</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Size</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Weight</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Price</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">City</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Vehicle</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Notes</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Edit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {todayShipments.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-8 text-center text-gray-500">
                    No shipments logged today
                  </td>
                </tr>
              ) : (
                todayShipments.map((shipment) => (
                  <tr key={shipment.id} className={`hover:bg-gray-50 ${editingId === shipment.id ? 'bg-blue-50' : ''}`}>
                    <td className="px-6 py-4 text-sm text-gray-900">{shipment.partyName}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{shipment.goodsType}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{shipment.size}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{shipment.weight}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">₹{shipment.price.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{shipment.deliveryCity}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{shipment.vehicle}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{shipment.notes}</td>
                    <td className="px-6 py-4">
                      <Button
                        onClick={() => handleEdit(shipment)}
                        size="small"
                        startIcon={<Edit />}
                        sx={{ textTransform: 'none' }}
                      >
                        Edit
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
