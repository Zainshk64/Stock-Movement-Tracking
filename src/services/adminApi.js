import api from './api';

const adminApi = {
  // ============ PRODUCTS ============
  
  // Get all products (admin - includes inactive)
  getAllProducts: async () => {
    const response = await api.get('/products/admin/all');
    return response.data;
  },

  // Get single product
  getProduct: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  // Create new product
  createProduct: async (productData) => {
    const response = await api.post('/products', productData);
    return response.data;
  },

  // Update product
  updateProduct: async (id, productData) => {
    const response = await api.put(`/products/${id}`, productData);
    return response.data;
  },

  // Delete product
  deleteProduct: async (id) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },

  // Get low stock products
  getLowStockProducts: async () => {
    const response = await api.get('/products/admin/low-stock');
    return response.data;
  },

  // ============ IMAGE UPLOAD ============
  
  // Upload single image
  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    
    const response = await api.post('/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Upload multiple images
  uploadMultipleImages: async (files) => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('images', file);
    });
    
    const response = await api.post('/upload/images', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Delete image from cloudinary
  deleteImage: async (publicId) => {
    const response = await api.delete(`/upload/image/${publicId}`);
    return response.data;
  },
};

export default adminApi;