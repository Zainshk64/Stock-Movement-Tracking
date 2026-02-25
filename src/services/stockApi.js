import api from './api';

const stockApi = {
  // ============ STOCK LOGS ============

  // Get all stock logs with filters
  getStockLogs: async (params = {}) => {
    const { type, settled, product, page = 1, limit = 20 } = params;
    
    const queryParams = new URLSearchParams();
    if (type && type !== 'all') queryParams.append('type', type);
    if (settled && settled !== 'all') queryParams.append('settled', settled === 'settled');
    if (product) queryParams.append('product', product);
    queryParams.append('page', page);
    queryParams.append('limit', limit);

    const response = await api.get(`/stock?${queryParams.toString()}`);
    return response.data;
  },

  // Get stock statistics
  getStockStats: async () => {
    const response = await api.get('/stock/stats');
    return response.data;
  },

  // Get unsettled transfers
  getUnsettledTransfers: async () => {
    const response = await api.get('/stock/unsettled');
    return response.data;
  },

  // ============ STOCK OPERATIONS ============

  // Add new stock
  addStock: async (data) => {
    const response = await api.post('/stock/add', data);
    return response.data;
  },

  // Record sale
  recordSale: async (data) => {
    const response = await api.post('/stock/sold', data);
    return response.data;
  },

  // Transfer stock to person/shop
  transferStock: async (data) => {
    const response = await api.post('/stock/transfer', data);
    return response.data;
  },

  // Settle transfer
  settleTransfer: async (id) => {
    const response = await api.put(`/stock/${id}/settle`);
    return response.data;
  },
};

export default stockApi;