import api from './api';

export interface VehiclePayload {
    id?: string;
    numberPlate: string;
    ownerName: string;
    ownerPhone: string;
    capacity: string;
    notes?: string;
}

export const vehicleService = {
    getVehicles: async () => {
        const response = await api.get('/vehicles');
        return response.data;
    },
    createVehicle: async (data: VehiclePayload) => {
        const response = await api.post('/vehicles', data);
        return response.data;
    },
    updateVehicle: async (id: string, data: VehiclePayload) => {
        const response = await api.put(`/vehicles/${id}`, data);
        return response.data;
    },
    deleteVehicle: async (id: string) => {
        const response = await api.delete(`/vehicles/${id}`);
        return response.data;
    },
};

