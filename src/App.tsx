import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';

import SidebarLayout from './layouts/SidebarLayout';
import Login from './pages/Login';

// Placeholder Pages (will be refactored subsequently)
import Dashboard from './pages/Dashboard';
import AddShipments from './pages/AddShipments';
import AddParty from './pages/AddParty';
import AddLorry from './pages/AddLorry';
import AddGoodsType from './pages/AddGoodsType';
import AddCity from './pages/AddCity';
import ViewLogs from './pages/ViewLogs';
import AdminPanel from './pages/AdminPanel';
import DownloadMaster from './pages/DownloadMaster';
import { shipmentService } from './services/shipmentService';
import { partyService } from './services/partyService';
import { vehicleService } from './services/vehicleService';
import { goodsTypeService } from './services/goodsTypeService';
import { cityService } from './services/cityService';

// Dummy interfaces mirroring original State while we refactor the screens.
export interface Shipment {
  id: string;
  customId?: string;
  date: string;
  partyName: string;
  goodsType: string;
  size: string;
  weight: string;
  weightUnit?: string;
  price: number;
  priceType?: string;
  pricePerKg?: number | null;
  deliveryCity: string;
  deliveryType?: string;
  vehicle: string;
  notes: string;
  status?: string;
  shippedDate?: string | null;
  dispatchedDate?: string | null;
  loadingVehicle?: string | null;
}

export interface Party {
  id: string;
  name: string;
  companyType: string;
  phone: string;
  address: string;
  description: string;
}

export interface Lorry {
  id: string;
  numberPlate: string;
  ownerName: string;
  ownerPhone: string;
  capacity: string;
  notes: string;
}

export interface GoodsType {
  id: string;
  name: string;
  notes: string;
}

export interface City {
  id: string;
  name: string;
}

// Material Design 3 theme with Deep Blue and Orange
const theme = createTheme({
  palette: {
    primary: {
      main: '#1565C0', // Deep Blue
    },
    secondary: {
      main: '#FF6F00', // Orange
    },
    background: {
      default: '#FFFFFF',
      paper: '#FFFFFF',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  spacing: 8, // 8px grid system
});

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  if (role !== 'admin') {
    return <Navigate to="/view-logs" replace />;
  }
  return <>{children}</>;
};

const IndexRoute = () => {
  const role = localStorage.getItem('role');
  if (role === 'viewer') {
    return <Navigate to="/view-logs" replace />;
  }
  return <Navigate to="/dashboard" replace />;
};

export default function App() {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [parties, setParties] = useState<Party[]>([]);
  const [lorries, setLorries] = useState<Lorry[]>([]);
  const [goodsTypes, setGoodsTypes] = useState<GoodsType[]>([]);
  const [cities, setCities] = useState<City[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return; // Do not fetch if not logged in

        const ds = await shipmentService.getShipments();
        setShipments(ds);

        const dp = await partyService.getParties();
        setParties(dp);

        const dv = await vehicleService.getVehicles();
        setLorries(dv);

        const dg = await goodsTypeService.getGoodsTypes();
        setGoodsTypes(dg);

        const dc = await cityService.getCities();
        setCities(dc);
      } catch (error) {
        console.error('Failed to load initial data:', error);
      }
    };
    loadData();
  }, []);

  const addShipment = async (shipment: any) => {
    try {
      const newShipment = await shipmentService.createShipment(shipment);
      setShipments([newShipment, ...shipments]);
    } catch (e) {
      console.error(e);
      alert('Failed to save shipment.');
    }
  };
  const updateShipment = async (id: string, updatedShipment: any) => {
    try {
      const updated = await shipmentService.updateShipment(id, updatedShipment);
      setShipments(shipments.map(s => s.id === id ? updated : s));
    } catch (e) {
      console.error(e);
      alert('Failed to update shipment.');
    }
  };
  const deleteShipment = async (id: string) => {
    if (!window.confirm('Delete this shipment?')) return;
    try {
      await shipmentService.deleteShipment(id);
      setShipments(shipments.filter(s => s.id !== id));
    } catch (e) {
      console.error(e);
      alert('Failed to delete shipment.');
    }
  };

  const markShipmentAsShipped = async (id: string, shipData: { vehicle: string; shippedDate: string; notes?: string }) => {
    try {
      const updated = await shipmentService.markAsShipped(id, shipData);
      setShipments(shipments.map(s => s.id === id ? updated : s));
    } catch (e) {
      console.error(e);
      alert('Failed to mark shipment as shipped.');
    }
  };

  const addParty = async (party: any) => {
    try {
      const newParty = await partyService.createParty(party);
      setParties([newParty, ...parties]);
    } catch (e) {
      console.error(e);
      alert('Failed to add party.');
    }
  };
  const updateParty = async (id: string, updatedParty: any) => {
    try {
      const updated = await partyService.updateParty(id, updatedParty);
      setParties(parties.map(p => p.id === id ? updated : p));
    } catch (e) {
      console.error(e);
      alert('Failed to update party.');
    }
  };
  const deleteParty = async (id: string) => {
    if (!window.confirm('Delete this party?')) return;
    try {
      await partyService.deleteParty(id);
      setParties(parties.filter(p => p.id !== id));
    } catch (e) {
      console.error(e);
      alert('Failed to delete party.');
    }
  };

  const addLorry = async (lorry: any) => {
    try {
      const newLorry = await vehicleService.createVehicle(lorry);
      setLorries([newLorry, ...lorries]);
    } catch (e) {
      console.error(e);
      alert('Failed to add lorry.');
    }
  };
  const updateLorry = async (id: string, updatedLorry: any) => {
    try {
      const updated = await vehicleService.updateVehicle(id, updatedLorry);
      setLorries(lorries.map(l => l.id === id ? updated : l));
    } catch (e) {
      console.error(e);
      alert('Failed to update lorry.');
    }
  };
  const deleteLorry = async (id: string) => {
    if (!window.confirm('Delete this vehicle?')) return;
    try {
      await vehicleService.deleteVehicle(id);
      setLorries(lorries.filter(l => l.id !== id));
    } catch (e) {
      console.error(e);
      alert('Failed to delete lorry.');
    }
  };

  const addGoodsType = async (goodsType: any) => {
    try {
      const newType = await goodsTypeService.createGoodsType(goodsType);
      setGoodsTypes([newType, ...goodsTypes]);
    } catch (e) {
      console.error(e);
      alert('Failed to add goods type.');
    }
  };
  const updateGoodsType = async (id: string, updatedGoodsType: any) => {
    try {
      const updated = await goodsTypeService.updateGoodsType(id, updatedGoodsType);
      setGoodsTypes(goodsTypes.map(g => g.id === id ? updated : g));
    } catch (e) {
      console.error(e);
      alert('Failed to update goods type.');
    }
  };
  const deleteGoodsType = async (id: string) => {
    if (!window.confirm('Delete this goods type?')) return;
    try {
      await goodsTypeService.deleteGoodsType(id);
      setGoodsTypes(goodsTypes.filter(g => g.id !== id));
    } catch (e) {
      console.error(e);
      alert('Failed to delete goods type.');
    }
  };

  const addCity = async (city: any) => {
    try {
      const newCity = await cityService.createCity(city);
      setCities([newCity, ...cities]);
    } catch (e) {
      console.error(e);
      alert('Failed to add city.');
    }
  };
  const updateCity = async (id: string, updatedCity: any) => {
    try {
      const updated = await cityService.updateCity(id, updatedCity);
      setCities(cities.map(c => c.id === id ? updated : c));
    } catch (e) {
      console.error(e);
      alert('Failed to update city.');
    }
  };
  const deleteCity = async (id: string) => {
    if (!window.confirm('Delete this city?')) return;
    try {
      await cityService.deleteCity(id);
      setCities(cities.filter(c => c.id !== id));
    } catch (e) {
      console.error(e);
      alert('Failed to delete city.');
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route path="/" element={<ProtectedRoute><SidebarLayout /></ProtectedRoute>}>
            <Route index element={<IndexRoute />} />
            <Route path="dashboard" element={<AdminRoute><Dashboard shipments={shipments} lorries={lorries} onMarkShipped={markShipmentAsShipped} /></AdminRoute>} />
            <Route
              path="add-shipments"
              element={
                <AdminRoute>
                  <AddShipments
                    shipments={shipments}
                    parties={parties}
                    goodsTypes={goodsTypes}
                    lorries={lorries}
                    cities={cities}
                    onAddShipment={addShipment}
                    onUpdateShipment={updateShipment}
                  />
                </AdminRoute>
              }
            />
            <Route
              path="add-party"
              element={<AdminRoute><AddParty parties={parties} onAddParty={addParty} onUpdateParty={updateParty} onDeleteParty={deleteParty} /></AdminRoute>}
            />
            <Route
              path="add-goods-types"
              element={<AdminRoute><AddGoodsType goodsTypes={goodsTypes} onAddGoodsType={addGoodsType} onUpdateGoodsType={updateGoodsType} onDeleteGoodsType={deleteGoodsType} /></AdminRoute>}
            />
            <Route
              path="add-lorry"
              element={<AdminRoute><AddLorry lorries={lorries} onAddLorry={addLorry} onUpdateLorry={updateLorry} onDeleteLorry={deleteLorry} /></AdminRoute>}
            />
            <Route
              path="add-city"
              element={<AdminRoute><AddCity cities={cities} onAddCity={addCity} onUpdateCity={updateCity} onDeleteCity={deleteCity} /></AdminRoute>}
            />
            <Route
              path="view-logs"
              element={<ViewLogs shipments={shipments} parties={parties} lorries={lorries} goodsTypes={goodsTypes} cities={cities} onDeleteShipment={deleteShipment} onUpdateShipment={updateShipment} />}
            />
            <Route
              path="admin-panel"
              element={<AdminRoute><AdminPanel /></AdminRoute>}
            />
            <Route
              path="download"
              element={<AdminRoute><DownloadMaster /></AdminRoute>}
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
