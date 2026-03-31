import { useState } from 'react';
import type { Shipment, Lorry } from '../App';
import { LocalShipping, Assignment, CheckCircle } from '@mui/icons-material';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Autocomplete } from '@mui/material';

interface DashboardProps {
  shipments: Shipment[];
  lorries: Lorry[];
  onMarkShipped?: (id: string, data: { vehicle: string; shippedDate: string; notes?: string }) => Promise<void>;
}

export default function Dashboard({ shipments, lorries, onMarkShipped }: DashboardProps) {
  const getLocalToday = () => {
    const d = new Date();
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().split('T')[0];
  };
  const today = getLocalToday();

  const pendingShipments = shipments.filter(s => !s.status || s.status === 'PENDING');

  const todayShipments = shipments.filter(s => {
    if (s.status !== 'SHIPPED') return false;
    const actualShippedDate = s.shippedDate || s.dispatchedDate;
    if (!actualShippedDate) return false;
    // ensure robust date comparison regardless of string/date types
    const dispatchDateStr = String(actualShippedDate).split('T')[0];
    return dispatchDateStr === today;
  });

  const activeVehicles = new Set(todayShipments.map(s => s.vehicle)).size;
  const todayRevenue = shipments.filter(s => s.date === today).reduce((sum, s) => sum + Number(s.price || 0), 0);

  const [shipModalOpen, setShipModalOpen] = useState(false);
  const [selectedShipmentId, setSelectedShipmentId] = useState<string | null>(null);
  const [shipFormData, setShipFormData] = useState({
    vehicle: '',
    shippedDate: today,
    notes: ''
  });

  const handleOpenShipModal = (shipment: Shipment) => {
    setSelectedShipmentId(shipment.id);
    setShipFormData({
      vehicle: shipment.vehicle || '',
      shippedDate: today,
      notes: shipment.notes || ''
    });
    setShipModalOpen(true);
  };

  const handleCloseShipModal = () => {
    setShipModalOpen(false);
    setSelectedShipmentId(null);
  };

  const handleConfirmShip = async () => {
    if (selectedShipmentId && onMarkShipped) {
      if (!shipFormData.vehicle || !shipFormData.shippedDate) {
        alert("Please fill all required fields.");
        return;
      }
      await onMarkShipped(selectedShipmentId, shipFormData);
      handleCloseShipModal();
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Dashboard</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Assignment className="text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Pending Shipments</p>
              <p className="text-3xl font-bold text-gray-900">{pendingShipments.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Assignment className="text-[#1565C0]" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Today's Shipped</p>
              <p className="text-3xl font-bold text-gray-900">{todayShipments.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <LocalShipping className="text-green-700" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Active Vehicles Today</p>
              <p className="text-xl font-bold text-gray-900">{activeVehicles}</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <span className="text-purple-700 font-bold text-xl">₹</span>
            </div>
            <div>
              <p className="text-sm text-gray-600">Today's Revenue</p>
              <p className="text-xl font-bold text-gray-900">₹{todayRevenue.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pending Shipments Section */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden border-t-4 border-t-orange-400">
        <div className="px-6 py-4 border-b border-gray-200 bg-orange-50/50">
          <h3 className="text-lg font-semibold text-orange-800">Pending Shipments</h3>
          <p className="text-sm text-orange-600">These shipments need to be marked as shipped.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-orange-50/50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Party Name</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Goods Type</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Size/Weight</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Delivery City</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Planned Vehicle</th>
                <th className="px-6 py-3 text-right text-sm font-medium text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {pendingShipments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500 bg-orange-50/30">
                    No pending shipments
                  </td>
                </tr>
              ) : (
                pendingShipments.map((shipment) => (
                  <tr key={shipment.id} className="bg-orange-50/70 hover:bg-orange-100/70 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">{shipment.partyName}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{shipment.goodsType}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{shipment.size} - {shipment.weight} {shipment.weightUnit || ''}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{shipment.deliveryCity}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{shipment.vehicle}</td>
                    <td className="px-6 py-4 text-right">
                      <Button
                        variant="contained"
                        color="warning"
                        size="small"
                        startIcon={<CheckCircle />}
                        onClick={() => handleOpenShipModal(shipment)}
                        sx={{ textTransform: 'none', fontWeight: 600, boxShadow: 'none' }}
                      >
                        Mark as Shipped
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Today's Shipment Logs */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold">Today's Shipped Logs</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Party Name</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Goods Type</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Size</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Weight</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Price</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Delivery City</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Vehicle</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {todayShipments.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                    No shipments marked as shipped today
                  </td>
                </tr>
              ) : (
                todayShipments.map((shipment) => (
                  <tr key={shipment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">{shipment.partyName}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{shipment.goodsType}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{shipment.size}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{shipment.weight} {shipment.weightUnit || ''}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">₹{Number(shipment.price || 0).toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{shipment.deliveryCity}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium text-green-700">{shipment.vehicle}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{shipment.notes}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mark As Shipped Dialog */}
      <Dialog open={shipModalOpen} onClose={handleCloseShipModal} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ pb: 1, fontWeight: 600 }}>Confirm Shipment dispatch</DialogTitle>
        <DialogContent sx={{ pt: '16px !important', pb: 2 }}>
          <div className="space-y-4">
            <Autocomplete
              options={lorries.map(l => l.numberPlate)}
              value={shipFormData.vehicle}
              onChange={(_, value) => setShipFormData({ ...shipFormData, vehicle: typeof value === 'string' ? value : value || '' })}
              onInputChange={(_, newInputValue) => setShipFormData({ ...shipFormData, vehicle: newInputValue })}
              freeSolo
              renderInput={(params) => (
                <TextField {...params} label="Vehicle" size="small" required fullWidth autoFocus />
              )}
            />

            <TextField
              label="Shipped Date"
              type="date"
              value={shipFormData.shippedDate}
              onChange={(e) => setShipFormData({ ...shipFormData, shippedDate: e.target.value })}
              size="small"
              required
              fullWidth
              InputLabelProps={{ shrink: true }}
              sx={{ mb: 2 }}
            />

            <TextField
              label="Notes"
              value={shipFormData.notes}
              onChange={(e) => setShipFormData({ ...shipFormData, notes: e.target.value })}
              size="small"
              fullWidth
              multiline
              rows={3}
              placeholder="Add or update shipment notes..."
            />
          </div>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, pt: 0 }}>
          <Button onClick={handleCloseShipModal} sx={{ textTransform: 'none' }} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleConfirmShip}
            variant="contained"
            color="primary"
            sx={{ textTransform: 'none' }}
          >
            Confirm Details
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
