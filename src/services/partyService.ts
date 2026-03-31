import api from './api';

export interface PartyPayload {
    id?: string;
    name: string;
    companyType: string;
    phone: string;
    address: string;
    description?: string;
}

export const partyService = {
    getParties: async () => {
        const response = await api.get('/parties');
        return response.data;
    },
    createParty: async (data: PartyPayload) => {
        const response = await api.post('/parties', data);
        return response.data;
    },
    updateParty: async (id: string, data: PartyPayload) => {
        const response = await api.put(`/parties/${id}`, data);
        return response.data;
    },
    deleteParty: async (id: string) => {
        const response = await api.delete(`/parties/${id}`);
        return response.data;
    },
};

