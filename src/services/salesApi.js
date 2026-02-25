import api from './api';

const salesApi = {
  // Get all sales with filters and pagination
  getSales: async (params = {}) => {
    const { product, customer, startDate, endDate, page = 1, limit = 20 } = params;

    const queryParams = new URLSearchParams();
    if (product) queryParams.append('product', product);
    if (customer) queryParams.append('customer', customer);
    if (startDate) queryParams.append('startDate', startDate);
    if (endDate) queryParams.append('endDate', endDate);
    queryParams.append('page', page);
    queryParams.append('limit', limit);

    const response = await api.get(`/sales?${queryParams.toString()}`);
    return response.data;
  },

  // Get single sale
  getSale: async (id) => {
    const response = await api.get(`/sales/${id}`);
    return response.data;
  },

  // Create new sale
  createSale: async (data) => {
    const response = await api.post('/sales', data);
    return response.data;
  },

  // Delete sale
  deleteSale: async (id) => {
    const response = await api.delete(`/sales/${id}`);
    return response.data;
  },

  // Get sales reports (daily/weekly/monthly/all)
  getSalesReports: async (period = 'all') => {
    const response = await api.get(`/sales/reports?period=${period}`);
    return response.data;
  },

  // Get dashboard statistics
  getDashboardStats: async () => {
    const response = await api.get('/sales/dashboard');
    return response.data;
  },
};

export default salesApi;