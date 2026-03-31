import api from './api';

export interface CityPayload {
    id?: string;
    name: string;
}

export const cityService = {
    getCities: async () => {
        const response = await api.get('/cities');
        return response.data;
    },
    createCity: async (data: CityPayload) => {
        const response = await api.post('/cities', data);
        return response.data;
    },
    updateCity: async (id: string, data: CityPayload) => {
        const response = await api.put(`/cities/${id}`, data);
        return response.data;
    },
    deleteCity: async (id: string) => {
        const response = await api.delete(`/cities/${id}`);
        return response.data;
    },
};
