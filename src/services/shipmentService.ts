import api from './api';

export interface ShipmentPayload {
    id?: string;
    date: string;
    partyName?: string;
    partyId?: string;
    goodsType: string;
    goodsTypeId?: string;
    size: string;
    weight: string;
    price: number;
    deliveryCity: string;
    vehicle?: string;
    vehicleId?: string;
    notes?: string;
    status?: string;
    shippedDate?: string | null;
    dispatchedDate?: string | null;
    loadingVehicle?: string | null;
}

export const shipmentService = {
    getShipments: async () => {
        const response = await api.get('/shipments');
        return response.data;
    },
    createShipment: async (data: ShipmentPayload) => {
        const response = await api.post('/shipments', data);
        return response.data;
    },
    updateShipment: async (id: string, data: ShipmentPayload) => {
        const response = await api.put(`/shipments/${id}`, data);
        return response.data;
    },
    deleteShipment: async (id: string) => {
        const response = await api.delete(`/shipments/${id}`);
        return response.data;
    },
    markAsShipped: async (id: string, data: { vehicle: string; shippedDate: string; notes?: string }) => {
        const response = await api.patch(`/shipments/${id}/ship`, data);
        return response.data;
    },
    getShipmentsByDate: async (date: string) => {
        const response = await api.get(`/shipments/filter/date?date=${date}`);
        return response.data;
    },
    getShipmentsByParty: async (partyId: string) => {
        const response = await api.get(`/shipments/party/${partyId}`);
        return response.data;
    },
    getShipmentsByVehicle: async (vehicleId: string) => {
        const response = await api.get(`/shipments/vehicle/${vehicleId}`);
        return response.data;
    },
};

