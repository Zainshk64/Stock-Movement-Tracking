import api from './api';

const productsApi = {
  // Get all products (public) with filters
  getProducts: async (params = {}) => {
    const { category, brand, search, minPrice, maxPrice, sort, featured, page = 1, limit = 12 } = params;

    const queryParams = new URLSearchParams();
    
    if (category && category !== 'All') queryParams.append('category', category);
    if (brand) queryParams.append('brand', brand);
    if (search) queryParams.append('search', search);
    if (minPrice) queryParams.append('minPrice', minPrice);
    if (maxPrice) queryParams.append('maxPrice', maxPrice);
    if (sort) queryParams.append('sort', sort);
    if (featured) queryParams.append('featured', featured);
    queryParams.append('page', page);
    queryParams.append('limit', limit);

    const response = await api.get(`/products?${queryParams.toString()}`);
    return response.data;
  },

  // Get single product by ID (public)
  getProduct: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  // Get featured products (public)
  getFeaturedProducts: async () => {
    const response = await api.get('/products/featured');
    return response.data;
  },
};

export default productsApi;