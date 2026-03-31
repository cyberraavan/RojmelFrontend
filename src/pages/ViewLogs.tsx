import { useState } from 'react';
import type { Shipment, Party, Lorry, GoodsType, City } from '../App';
import { TextField, Autocomplete, Tabs, Tab, Button, Dialog, DialogTitle, DialogContent, DialogActions, Select, MenuItem, FormControl, InputLabel, RadioGroup, FormControlLabel, Radio, InputAdornment } from '@mui/material';
import { Delete, Download, Edit } from '@mui/icons-material';
import * as xlsx from 'xlsx';

interface ViewLogsProps {
  shipments: Shipment[];
  parties: Party[];
  lorries: Lorry[];
  goodsTypes: GoodsType[];
  cities: City[];
  onDeleteShipment: (id: string) => void;
  onUpdateShipment: (id: string, shipment: Shipment) => void;
}

export default function ViewLogs({ shipments, parties, lorries, goodsTypes, cities, onDeleteShipment, onUpdateShipment }: ViewLogsProps) {
  const role = localStorage.getItem('role') || 'admin';
  const [activeTab, setActiveTab] = useState(0);
  const getLocalToday = () => {
    const d = new Date();
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().split('T')[0];
  };
  const getFirstDayOfMonth = () => {
    const d = new Date();
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    d.setDate(1);
    return d.toISOString().split('T')[0];
  };
  const [fromDate, setFromDate] = useState(getFirstDayOfMonth());
  const [toDate, setToDate] = useState(getLocalToday());
  const [selectedParty, setSelectedParty] = useState('');
  const [selectedLorry, setSelectedLorry] = useState('');

  // Date Tab specific state
  const [dateFilterType, setDateFilterType] = useState('booking');

  // Misc Tab specific state
  const [miscDateType, setMiscDateType] = useState('booking');
  const [miscFromDate, setMiscFromDate] = useState('');
  const [miscToDate, setMiscToDate] = useState('');
  const [miscParty, setMiscParty] = useState('');
  const [miscLorry, setMiscLorry] = useState('');

  // Edit Modal State
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingShipmentId, setEditingShipmentId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState({
    date: '',
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

  const handleOpenEditModal = (shipment: Shipment) => {
    setEditingShipmentId(shipment.id);
    setEditFormData({
      date: shipment.date,
      partyName: shipment.partyName,
      goodsType: shipment.goodsType,
      size: shipment.size,
      weight: shipment.weight,
      weightUnit: shipment.weightUnit || 'KG',
      price: shipment.price?.toString() || '',
      priceType: shipment.priceType || 'TOTAL',
      pricePerKg: shipment.pricePerKg?.toString() || '',
      deliveryCity: shipment.deliveryCity,
      deliveryType: shipment.deliveryType || 'DD',
      vehicle: shipment.vehicle || '',
      notes: shipment.notes || ''
    });
    setEditModalOpen(true);
  };

  const handleSaveEdit = () => {
    if (editingShipmentId) {
      onUpdateShipment(editingShipmentId, {
        id: editingShipmentId,
        date: editFormData.date,
        partyName: editFormData.partyName,
        goodsType: editFormData.goodsType,
        size: editFormData.size,
        weight: editFormData.weight,
        weightUnit: editFormData.weightUnit,
        price: parseFloat(editFormData.price) || 0,
        priceType: editFormData.priceType,
        pricePerKg: editFormData.pricePerKg ? parseFloat(editFormData.pricePerKg) : null,
        deliveryCity: editFormData.deliveryCity,
        deliveryType: editFormData.deliveryType,
        vehicle: editFormData.vehicle,
        notes: editFormData.notes
      });
      setEditModalOpen(false);
      setEditingShipmentId(null);
    }
  };

  const getFilteredShipments = () => {
    if (activeTab === 0) {
      // Filter by specified date type
      return shipments.filter(s => {
        const targetDate = dateFilterType === 'shipped' 
          ? (s.shippedDate ? String(s.shippedDate).split('T')[0] : null)
          : s.date;
        if (!targetDate) return false;
        const afterFrom = fromDate ? targetDate >= fromDate : true;
        const beforeTo = toDate ? targetDate <= toDate : true;
        return afterFrom && beforeTo;
      });
    } else if (activeTab === 1) {
      // Filter by party
      return selectedParty ? shipments.filter(s => s.partyName === selectedParty) : [];
    } else if (activeTab === 2) {
      // Filter by lorry
      return selectedLorry ? shipments.filter(s => s.vehicle === selectedLorry) : [];
    } else {
      // Misc Tab - Combine filters
      return shipments.filter(s => {
        let match = true;
        
        // Date filter
        if (miscFromDate || miscToDate) {
          const targetDate = miscDateType === 'shipped' 
            ? (s.shippedDate ? String(s.shippedDate).split('T')[0] : null)
            : s.date;
          if (!targetDate) match = false;
          else {
            if (miscFromDate && targetDate < miscFromDate) match = false;
            if (miscToDate && targetDate > miscToDate) match = false;
          }
        }
        
        // Party filter
        if (miscParty && s.partyName !== miscParty) match = false;
        
        // Lorry filter
        if (miscLorry && s.vehicle !== miscLorry) match = false;
        
        return match;
      });
    }
  };

  const filteredShipments = getFilteredShipments();

  const handleExportCSV = () => {
    if (filteredShipments.length === 0) {
        alert("No data to export");
        return;
    }
    const headers = ['Booking Date', 'Shipped Date', 'Custom ID', 'Party', 'Goods Type', 'Size', 'Weight', 'Price', 'Delivery City', 'Vehicle', 'Notes', 'Status'];
    const rows = filteredShipments.map(s => [
        s.date,
        s.shippedDate ? String(s.shippedDate).split('T')[0] : '',
        s.customId,
        s.partyName,
        s.goodsType,
        s.size,
        `${s.weight} ${s.weightUnit || ''}`.trim(),
        s.price,
        s.deliveryCity,
        s.vehicle,
        s.notes || '',
        s.status || ''
    ]);
    
    const csvContent = [
        headers.join(','),
        ...rows.map(ro => ro.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `shipments_export_${getLocalToday()}.csv`;
    link.click();
  };

  const handleExportExcel = () => {
    if (filteredShipments.length === 0) {
        alert("No data to export");
        return;
    }
    const excelData = filteredShipments.map(s => ({
        'Booking Date': s.date,
        'Shipped Date': s.shippedDate ? String(s.shippedDate).split('T')[0] : '',
        'Custom ID': s.customId,
        'Party': s.partyName,
        'Goods Type': s.goodsType,
        'Size': s.size,
        'Weight': `${s.weight} ${s.weightUnit || ''}`.trim(),
        'Price': s.price,
        'Delivery City': s.deliveryCity,
        'Vehicle': s.vehicle,
        'Notes': s.notes || '',
        'Status': s.status || ''
    }));
    
    const worksheet = xlsx.utils.json_to_sheet(excelData);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Filtered Shipments');
    
    xlsx.writeFile(workbook, `shipments_export_${getLocalToday()}.xlsx`);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">View Logs</h2>

      {/* Tabs */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <Tabs
          value={activeTab}
          onChange={(_, newValue) => setActiveTab(newValue)}
          sx={{ borderBottom: 1, borderColor: 'divider', px: 3 }}
        >
          <Tab label="Date" sx={{ textTransform: 'none', fontSize: '16px' }} />
          <Tab label="Party" sx={{ textTransform: 'none', fontSize: '16px' }} />
          <Tab label="Lorry" sx={{ textTransform: 'none', fontSize: '16px' }} />
          <Tab label="Misc" sx={{ textTransform: 'none', fontSize: '16px' }} />
        </Tabs>

        {/* Tab Content */}
        <div className="p-6">
          {/* Date Tab */}
          {activeTab === 0 && (
            <div className="mb-6 flex flex-col sm:flex-row gap-4">
              <TextField
                select
                label="Date Type"
                value={dateFilterType}
                onChange={(e) => setDateFilterType(e.target.value)}
                SelectProps={{ native: true }}
                sx={{ width: '180px' }}
                size="medium"
              >
                <option value="booking">Booking Date</option>
                <option value="shipped">Shipped Date</option>
              </TextField>
              <TextField
                label="From Date"
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{ width: '200px' }}
              />
              <TextField
                label="To Date"
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{ width: '200px' }}
              />
            </div>
          )}

          {/* Party Tab */}
          {activeTab === 1 && (
            <div className="mb-6">
              <Autocomplete
                options={parties.map(p => p.name)}
                value={selectedParty}
                onChange={(_, value) => setSelectedParty(value || '')}
                sx={{ width: { xs: '100%', sm: '300px' } }}
                renderInput={(params) => (
                  <TextField {...params} label="Select Party" />
                )}
              />
            </div>
          )}

          {/* Lorry Tab */}
          {activeTab === 2 && (
            <div className="mb-6">
              <Autocomplete
                options={lorries.map(l => l.numberPlate)}
                value={selectedLorry}
                onChange={(_, value) => setSelectedLorry(value || '')}
                sx={{ width: { xs: '100%', sm: '300px' } }}
                renderInput={(params) => (
                  <TextField {...params} label="Select Vehicle" />
                )}
              />
            </div>
          )}

          {/* Misc Tab */}
          {activeTab === 3 && (
            <div className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Autocomplete
                options={parties.map(p => p.name)}
                value={miscParty}
                onChange={(_, value) => setMiscParty(value || '')}
                renderInput={(params) => (
                  <TextField {...params} label="Filter by Party (Optional)" />
                )}
              />
              <Autocomplete
                options={lorries.map(l => l.numberPlate)}
                value={miscLorry}
                onChange={(_, value) => setMiscLorry(value || '')}
                renderInput={(params) => (
                  <TextField {...params} label="Filter by Vehicle (Optional)" />
                )}
              />
              <TextField
                select
                label="Date Type"
                value={miscDateType}
                onChange={(e) => setMiscDateType(e.target.value)}
                SelectProps={{ native: true }}
                fullWidth
              >
                <option value="booking">Booking Date</option>
                <option value="shipped">Shipped Date</option>
              </TextField>
              <div className="flex gap-2 lg:col-span-1">
                <TextField
                  label="From"
                  type="date"
                  value={miscFromDate}
                  onChange={(e) => setMiscFromDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />
                <TextField
                  label="To"
                  type="date"
                  value={miscToDate}
                  onChange={(e) => setMiscToDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />
              </div>
            </div>
          )}

          {/* Export Buttons */}
          <div className="flex justify-end mb-4 gap-2">
            <Button variant="outlined" startIcon={<Download />} onClick={handleExportCSV}>
              Export CSV
            </Button>
            <Button variant="contained" startIcon={<Download />} onClick={handleExportExcel}>
              Export Excel
            </Button>
          </div>

          {/* Results Table */}
          <div className="overflow-x-auto border border-gray-200 rounded-lg">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Booking Dt.</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Shipped Dt.</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Party</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Goods</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Size</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Weight</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Price</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Delivery City</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Vehicle</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Notes</th>
                  {role === 'admin' && <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Action</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredShipments.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="px-6 py-8 text-center text-gray-500">
                      {activeTab === 0 && 'No shipments found for the selected date'}
                      {activeTab === 1 && (selectedParty ? 'No shipments found for the selected party' : 'Please select a party to view logs')}
                      {activeTab === 2 && (selectedLorry ? 'No shipments found for the selected vehicle' : 'Please select a vehicle to view logs')}
                      {activeTab === 3 && 'No shipments match your Misc filters'}
                    </td>
                  </tr>
                ) : (
                  filteredShipments.map((shipment) => (
                    <tr key={shipment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">{shipment.date}</td>
                      <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">{shipment.shippedDate ? String(shipment.shippedDate).split('T')[0] : '-'}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{shipment.partyName}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{shipment.goodsType}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{shipment.size}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{shipment.weight} {shipment.weightUnit || ''}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">₹{Number(shipment.price || 0).toLocaleString()}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{shipment.deliveryCity}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{shipment.vehicle}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{shipment.notes}</td>
                      {role === 'admin' && (
                        <td className="px-6 py-4 flex gap-2">
                          <Button
                            onClick={() => handleOpenEditModal(shipment)}
                            size="small"
                            color="primary"
                            startIcon={<Edit />}
                            sx={{ textTransform: 'none' }}
                          >
                            Edit
                          </Button>
                          <Button
                            onClick={() => onDeleteShipment(shipment.id)}
                            size="small"
                            color="error"
                            startIcon={<Delete />}
                            sx={{ textTransform: 'none' }}
                          >
                            Delete
                          </Button>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Summary */}
          {filteredShipments.length > 0 && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg flex gap-8">
              <div>
                <p className="text-sm text-gray-600">Total Shipments</p>
                <p className="text-xl font-bold text-gray-900">{filteredShipments.length}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-xl font-bold text-gray-900">
                  ₹{filteredShipments.reduce((sum, s) => sum + Number(s.price || 0), 0).toLocaleString()}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit Shipment Dialog */}
      <Dialog open={editModalOpen} onClose={() => setEditModalOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ pb: 1, fontWeight: 600 }}>Edit Shipment Log</DialogTitle>
        <DialogContent sx={{ pt: '24px !important', pb: 2 }}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <TextField
              label="Date"
              type="date"
              value={editFormData.date}
              onChange={(e) => setEditFormData({ ...editFormData, date: e.target.value })}
              size="small"
              required
              InputLabelProps={{ shrink: true }}
            />
            <Autocomplete
              options={cities.map(c => c.name)}
              value={editFormData.deliveryCity}
              onChange={(_, value) => setEditFormData({ ...editFormData, deliveryCity: typeof value === 'string' ? value : value || '' })}
              onInputChange={(_, newInputValue) => setEditFormData({ ...editFormData, deliveryCity: newInputValue })}
              freeSolo
              renderInput={(params) => <TextField {...params} label="Delivery City" size="small" required />}
            />
            <Autocomplete
              options={parties.map(p => p.name)}
              value={editFormData.partyName}
              onChange={(_, value) => setEditFormData({ ...editFormData, partyName: typeof value === 'string' ? value : value || '' })}
              onInputChange={(_, newInputValue) => setEditFormData({ ...editFormData, partyName: newInputValue })}
              freeSolo
              renderInput={(params) => <TextField {...params} label="Party Name" size="small" required />}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <Autocomplete
              options={goodsTypes.map(g => g.name)}
              value={editFormData.goodsType}
              onChange={(_, value) => setEditFormData({ ...editFormData, goodsType: typeof value === 'string' ? value : value || '' })}
              onInputChange={(_, newInputValue) => setEditFormData({ ...editFormData, goodsType: newInputValue })}
              freeSolo
              renderInput={(params) => <TextField {...params} label="Goods Type" size="small" required />}
            />
            <Autocomplete
              options={editFormData.goodsType === 'Power Press' ? ['10 TON', '20 TON', '30 TON', '40 TON', '50 TON', '60 TON', '80 TON', '100 TON'] :
                editFormData.goodsType === 'Lathe Machine' ? ['4.5 FEET', '5.5 FEET', '6 FEET', '7 FEET', '9 FEET', '10 FEET', '12 FEET', '16 FEET', '18 FEET', '20 FEET', '24 FEET'] : []}
              value={editFormData.size}
              onChange={(_, value) => setEditFormData({ ...editFormData, size: typeof value === 'string' ? value : value || '' })}
              onInputChange={(_, newInputValue) => setEditFormData({ ...editFormData, size: newInputValue })}
              freeSolo
              renderInput={(params) => <TextField {...params} label="Size of Goods" size="small" required />}
            />
            <div className="flex gap-2">
              <TextField
                label="Weight"
                value={editFormData.weight}
                onChange={(e) => setEditFormData({ ...editFormData, weight: e.target.value })}
                size="small"
                required
                fullWidth
              />
              <FormControl size="small" sx={{ minWidth: 80 }}>
                <InputLabel id="weight-unit-label-edit">Unit</InputLabel>
                <Select
                  labelId="weight-unit-label-edit"
                  value={editFormData.weightUnit}
                  label="Unit"
                  onChange={(e) => setEditFormData({ ...editFormData, weightUnit: e.target.value })}
                >
                  <MenuItem value="KG">KG</MenuItem>
                  <MenuItem value="TON">TON</MenuItem>
                </Select>
              </FormControl>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <FormControl component="fieldset" size="small">
              <RadioGroup
                row
                value={editFormData.priceType}
                onChange={(e) => setEditFormData({ ...editFormData, priceType: e.target.value })}
              >
                <FormControlLabel value="TOTAL" control={<Radio size="small" />} label={<span className="text-xs">Overall</span>} />
                <FormControlLabel value="PER_KG" control={<Radio size="small" />} label={<span className="text-xs">Per KG</span>} />
                <FormControlLabel value="BOTH" control={<Radio size="small" />} label={<span className="text-xs">Both</span>} />
              </RadioGroup>
            </FormControl>
            <div className="flex flex-col sm:flex-row gap-2 col-span-1 md:col-span-2">
              {(editFormData.priceType === 'PER_KG' || editFormData.priceType === 'BOTH') && (
                <TextField
                  label="Price Per KG"
                  type="number"
                  value={editFormData.pricePerKg}
                  onChange={(e) => {
                    const val = e.target.value;
                    let total = editFormData.price;
                    if (val && editFormData.weight) {
                      const weightNum = parseFloat(editFormData.weight);
                      const perKg = parseFloat(val);
                      if (!isNaN(weightNum) && !isNaN(perKg)) {
                        const multiplier = editFormData.weightUnit === 'TON' ? 1000 : 1;
                        total = (weightNum * multiplier * perKg).toString();
                      }
                    }
                    setEditFormData({ ...editFormData, pricePerKg: val, price: total });
                  }}
                  size="small"
                  required
                  InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }}
                  fullWidth
                />
              )}
              {(editFormData.priceType === 'TOTAL' || editFormData.priceType === 'BOTH') && (
                <TextField
                  label="Total Price"
                  type="number"
                  value={editFormData.price}
                  onChange={(e) => setEditFormData({ ...editFormData, price: e.target.value })}
                  size="small"
                  required
                  InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }}
                  fullWidth
                />
              )}
              {editFormData.priceType === 'PER_KG' && (
                <TextField
                  label="Calc Total"
                  value={editFormData.price}
                  size="small"
                  disabled
                  InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }}
                  fullWidth
                />
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <FormControl component="fieldset" size="small">
              <RadioGroup
                row
                value={editFormData.deliveryType}
                onChange={(e) => setEditFormData({ ...editFormData, deliveryType: e.target.value })}
              >
                <FormControlLabel value="DD" control={<Radio size="small" />} label={<span className="text-xs">DD</span>} />
                <FormControlLabel value="GG" control={<Radio size="small" />} label={<span className="text-xs">GG</span>} />
                <FormControlLabel value="DG" control={<Radio size="small" />} label={<span className="text-xs">DG</span>} />
                <FormControlLabel value="GD" control={<Radio size="small" />} label={<span className="text-xs">GD</span>} />
              </RadioGroup>
            </FormControl>
            <Autocomplete
              options={lorries.map(l => l.numberPlate)}
              value={editFormData.vehicle}
              onChange={(_, value) => setEditFormData({ ...editFormData, vehicle: typeof value === 'string' ? value : value || '' })}
              onInputChange={(_, newInputValue) => setEditFormData({ ...editFormData, vehicle: newInputValue })}
              freeSolo
              renderInput={(params) => <TextField {...params} label="Loading Vehicle" size="small" required />}
            />
            <TextField
              label="Extra Notes"
              value={editFormData.notes}
              onChange={(e) => setEditFormData({ ...editFormData, notes: e.target.value })}
              size="small"
              multiline
            />
          </div>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, pt: 0 }}>
          <Button onClick={() => setEditModalOpen(false)} sx={{ textTransform: 'none' }} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleSaveEdit}
            variant="contained"
            color="primary"
            sx={{ textTransform: 'none' }}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
