import api from './api';

export interface GoodsTypePayload {
    id?: string;
    name: string;
    notes?: string;
}

export const goodsTypeService = {
    getGoodsTypes: async () => {
        const response = await api.get('/goods-types');
        return response.data;
    },
    createGoodsType: async (data: GoodsTypePayload) => {
        const response = await api.post('/goods-types', data);
        return response.data;
    },
    updateGoodsType: async (id: string, data: GoodsTypePayload) => {
        const response = await api.put(`/goods-types/${id}`, data);
        return response.data;
    },
    deleteGoodsType: async (id: string) => {
        const response = await api.delete(`/goods-types/${id}`);
        return response.data;
    },
};

