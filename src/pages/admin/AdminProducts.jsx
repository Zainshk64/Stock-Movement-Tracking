import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiSearch,
  FiPackage,
  FiX,
  FiAlertTriangle,
  FiUpload,
  FiImage,
  FiLoader,
  FiCheck,
  FiStar,
} from 'react-icons/fi';
import Button from '../../components/Button';
import AlertMessage from '../../components/AlertMessage';
import LoadingSpinner from '../../components/LoadingSpinner';
import adminApi from '../../services/adminApi';

// Categories list
const categories = ['Smartphones', 'Accessories', 'Tablets', 'Wearables'];

// Format price helper
const formatPrice = (price) => {
  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    minimumFractionDigits: 0,
  }).format(price);
};

// Empty product template
const emptyProduct = {
  name: '',
  brand: '',
  category: 'Smartphones',
  price: '',
  originalPrice: '',
  stock: '',
  description: '',
  image: '',
  featured: false,
  specifications: {},
};

// Specification fields template
const specFields = ['Display', 'Processor', 'RAM', 'Storage', 'Battery', 'Camera'];

export default function AdminProducts() {
  // State
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [alert, setAlert] = useState({ type: '', message: '' });

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Form state
  const [form, setForm] = useState(emptyProduct);
  const [specifications, setSpecifications] = useState({});
  const [formLoading, setFormLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Image upload state
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef(null);

  // Fetch products on mount
  useEffect(() => {
    fetchProducts();
  }, []);

  // Clear alert after 5 seconds
  useEffect(() => {
    if (alert.message) {
      const timer = setTimeout(() => {
        setAlert({ type: '', message: '' });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  // Fetch all products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await adminApi.getAllProducts();
      if (response.success) {
        setProducts(response.data);
      }
    } catch (error) {
      setAlert({ type: 'error', message: error.message || 'Failed to fetch products' });
    } finally {
      setLoading(false);
    }
  };

  // Filter products by search
  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.toLowerCase())
  );

  // Open add modal
  const openAddModal = () => {
    setEditingProduct(null);
    setForm(emptyProduct);
    setSpecifications({});
    setImageFile(null);
    setImagePreview('');
    setModalOpen(true);
  };

  // Open edit modal
  const openEditModal = (product) => {
    setEditingProduct(product);
    setForm({
      name: product.name,
      brand: product.brand,
      category: product.category,
      price: product.price,
      originalPrice: product.originalPrice || '',
      stock: product.stock,
      description: product.description || '',
      image: product.image || '',
      featured: product.featured || false,
      specifications: product.specifications || {},
    });
    // Convert Map to object if needed
    const specs = product.specifications || {};
    setSpecifications(typeof specs === 'object' ? specs : {});
    setImageFile(null);
    setImagePreview(product.image || '');
    setModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setModalOpen(false);
    setEditingProduct(null);
    setForm(emptyProduct);
    setSpecifications({});
    setImageFile(null);
    setImagePreview('');
  };

  // Handle form change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  // Handle specification change
  const handleSpecChange = (key, value) => {
    setSpecifications({
      ...specifications,
      [key]: value,
    });
  };

  // Handle image selection
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setAlert({ type: 'error', message: 'Please select an image file' });
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setAlert({ type: 'error', message: 'Image size must be less than 5MB' });
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Remove selected image
  const removeImage = () => {
    setImageFile(null);
    setImagePreview(editingProduct?.image || '');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Upload image to server
  const uploadImage = async () => {
    if (!imageFile) return form.image || '';

    try {
      setUploadingImage(true);
      const response = await adminApi.uploadImage(imageFile);
      if (response.success) {
        return response.data.url;
      }
      throw new Error('Upload failed');
    } catch (error) {
      throw new Error(error.message || 'Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  // Save product (create or update)
  const handleSave = async (e) => {
    e.preventDefault();
    setFormLoading(true);

    try {
      // Upload image first if new file selected
      let imageUrl = form.image;
      if (imageFile) {
        imageUrl = await uploadImage();
      }

      // Prepare product data
      const productData = {
        name: form.name.trim(),
        brand: form.brand.trim(),
        category: form.category,
        price: Number(form.price),
        originalPrice: form.originalPrice ? Number(form.originalPrice) : Number(form.price),
        stock: Number(form.stock),
        description: form.description.trim(),
        image: imageUrl,
        featured: form.featured,
        specifications: Object.fromEntries(
          Object.entries(specifications).filter(([_, value]) => value.trim() !== '')
        ),
      };

      let response;
      if (editingProduct) {
        // Update existing product
        response = await adminApi.updateProduct(editingProduct._id, productData);
      } else {
        // Create new product
        response = await adminApi.createProduct(productData);
      }

      if (response.success) {
        setAlert({
          type: 'success',
          message: editingProduct
            ? 'Product updated successfully!'
            : 'Product created successfully!',
        });
        closeModal();
        fetchProducts(); // Refresh list
      }
    } catch (error) {
      setAlert({ type: 'error', message: error.message || 'Failed to save product' });
    } finally {
      setFormLoading(false);
    }
  };

  // Delete product
  const handleDelete = async () => {
    if (!deleteConfirm) return;

    setDeleteLoading(true);
    try {
      const response = await adminApi.deleteProduct(deleteConfirm._id);
      if (response.success) {
        setAlert({ type: 'success', message: 'Product deleted successfully!' });
        setDeleteConfirm(null);
        fetchProducts(); // Refresh list
      }
    } catch (error) {
      setAlert({ type: 'error', message: error.message || 'Failed to delete product' });
    } finally {
      setDeleteLoading(false);
    }
  };

  // Get stock status
  const getStockStatus = (stock) => {
    if (stock === 0) return { label: 'Out of Stock', color: 'bg-red-100 text-red-600' };
    if (stock <= 5) return { label: 'Low Stock', color: 'bg-yellow-100 text-yellow-600 ' };
    return { label: 'In Stock', color: 'bg-green-100 text-green-600' };
  };

  const inputClasses =
    'w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm text-foreground placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed';

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Alert */}
      <AlertMessage
        type={alert.type}
        message={alert.message}
        onClose={() => setAlert({ type: '', message: '' })}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Products</h2>
          <p className="text-sm text-muted mt-1">{products.length} total products</p>
        </div>
        <Button icon={<FiPlus />} onClick={openAddModal}>
          Add Product
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`${inputClasses} pl-11`}
        />
      </div>

      {/* Table */}
      <div className="bg-surface border border-border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-background">
                {['Product', 'Category', 'Price', 'Stock', 'Status', 'Featured', 'Actions'].map((h) => (
                  <th
                    key={h}
                    className="text-left text-xs font-semibold text-muted uppercase tracking-wider px-6 py-4"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredProducts.map((product, index) => {
                const status = getStockStatus(product.stock);
                return (
                  <motion.tr
                    key={product._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className="hover:bg-background/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-background border border-border overflow-hidden shrink-0">
                          <img
                            src={product.image || 'https://via.placeholder.com/100?text=No+Image'}
                            alt={product.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/100?text=No+Image';
                            }}
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-foreground truncate max-w-[200px]">
                            {product.name}
                          </p>
                          <p className="text-xs text-muted">{product.brand}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-foreground">
                        {formatPrice(product.price)}
                      </p>
                      {product.originalPrice > product.price && (
                        <p className="text-xs text-muted line-through">
                          {formatPrice(product.originalPrice)}
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-foreground">{product.stock}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${status.color}`}>
                        {status.label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {product.featured && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700  text-xs font-medium rounded-full">
                          <FiStar className="w-3 h-3" />
                          Featured
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEditModal(product)}
                          className="p-2 rounded-lg hover:bg-primary/10 text-primary transition-colors cursor-pointer"
                          title="Edit"
                        >
                          <FiEdit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(product)}
                          className="p-2 rounded-lg hover:bg-red-100  text-red-500 transition-colors cursor-pointer"
                          title="Delete"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredProducts.length === 0 && (
          <div className="p-12 text-center">
            <FiPackage className="w-12 h-12 text-muted mx-auto mb-4" />
            <p className="text-muted">
              {search ? 'No products found matching your search' : 'No products yet'}
            </p>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-secondary/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-surface border border-border rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-border flex items-center justify-between shrink-0">
                <h3 className="text-lg font-bold text-foreground">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h3>
                <button
                  onClick={closeModal}
                  disabled={formLoading}
                  className="p-2 rounded-lg hover:bg-background text-muted transition-colors cursor-pointer disabled:opacity-50"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <form onSubmit={handleSave} className="p-6 space-y-5 overflow-y-auto flex-1">
                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Product Image
                  </label>
                  <div className="flex items-start gap-4">
                    {/* Preview */}
                    <div className="w-32 h-32 rounded-xl bg-background border-2 border-dashed border-border overflow-hidden flex items-center justify-center shrink-0">
                      {imagePreview ? (
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <FiImage className="w-8 h-8 text-muted" />
                      )}
                    </div>

                    {/* Upload Controls */}
                    <div className="flex-1 space-y-3">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageSelect}
                        className="hidden"
                        id="image-upload"
                      />
                      <label
                        htmlFor="image-upload"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-background border border-border rounded-xl text-sm font-medium text-foreground hover:bg-border/50 transition-colors cursor-pointer"
                      >
                        <FiUpload className="w-4 h-4" />
                        {imageFile ? 'Change Image' : 'Upload Image'}
                      </label>

                      {imageFile && (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted truncate max-w-[150px]">
                            {imageFile.name}
                          </span>
                          <button
                            type="button"
                            onClick={removeImage}
                            className="text-red-500 hover:text-red-600 text-xs font-medium cursor-pointer"
                          >
                            Remove
                          </button>
                        </div>
                      )}

                      <p className="text-xs text-muted">
                        PNG, JPG, WEBP up to 5MB. Recommended: 500x500px
                      </p>
                    </div>
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    disabled={formLoading}
                    className={inputClasses}
                    placeholder="iPhone 15 Pro Max"
                  />
                </div>

                {/* Brand & Category */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">
                      Brand *
                    </label>
                    <input
                      type="text"
                      name="brand"
                      value={form.brand}
                      onChange={handleChange}
                      required
                      disabled={formLoading}
                      className={inputClasses}
                      placeholder="Apple"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">
                      Category *
                    </label>
                    <select
                      name="category"
                      value={form.category}
                      onChange={handleChange}
                      disabled={formLoading}
                      className={inputClasses}
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Price, Original Price, Stock */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">
                      Price (PKR) *
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={form.price}
                      onChange={handleChange}
                      required
                      min="0"
                      disabled={formLoading}
                      className={inputClasses}
                      placeholder="159900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">
                      Original Price
                    </label>
                    <input
                      type="number"
                      name="originalPrice"
                      value={form.originalPrice}
                      onChange={handleChange}
                      min="0"
                      disabled={formLoading}
                      className={inputClasses}
                      placeholder="169900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">
                      Stock *
                    </label>
                    <input
                      type="number"
                      name="stock"
                      value={form.stock}
                      onChange={handleChange}
                      required
                      min="0"
                      disabled={formLoading}
                      className={inputClasses}
                      placeholder="10"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows={3}
                    disabled={formLoading}
                    className={inputClasses}
                    placeholder="Product description..."
                  />
                </div>

                {/* Specifications */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-3">
                    Specifications
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {specFields.map((spec) => (
                      <div key={spec}>
                        <label className="block text-xs text-muted mb-1">{spec}</label>
                        <input
                          type="text"
                          value={specifications[spec] || ''}
                          onChange={(e) => handleSpecChange(spec, e.target.value)}
                          disabled={formLoading}
                          className={`${inputClasses} py-2 text-xs`}
                          placeholder={`Enter ${spec.toLowerCase()}`}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Featured Toggle */}
                <div className="flex items-center gap-3">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="featured"
                      checked={form.featured}
                      onChange={handleChange}
                      disabled={formLoading}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-border rounded-full peer peer-checked:bg-primary peer-focus:ring-2 peer-focus:ring-primary/20 transition-colors after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
                  </label>
                  <span className="text-sm font-medium text-foreground">Featured Product</span>
                </div>

                {/* Form Actions */}
                <div className="flex gap-3 pt-4 border-t border-border">
                  <button
                    type="button"
                    onClick={closeModal}
                    disabled={formLoading}
                    className="flex-1 px-4 py-2.5 bg-background border border-border rounded-xl text-sm font-medium text-foreground hover:bg-border/50 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={formLoading || uploadingImage}
                    className="flex-1 px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-dark transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {formLoading || uploadingImage ? (
                      <>
                        <LoadingSpinner size="sm" color="white" />
                        {uploadingImage ? 'Uploading...' : 'Saving...'}
                      </>
                    ) : (
                      <>
                        <FiCheck className="w-4 h-4" />
                        {editingProduct ? 'Update' : 'Add'} Product
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-secondary/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => !deleteLoading && setDeleteConfirm(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-surface border border-border rounded-2xl w-full max-w-sm p-6"
            >
              <div className="w-12 h-12 bg-red-100rounded-xl flex items-center justify-center mx-auto mb-4">
                <FiAlertTriangle className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="text-lg font-bold text-foreground text-center mb-2">
                Delete Product
              </h3>
              <p className="text-sm text-muted text-center mb-6">
                Are you sure you want to delete "{deleteConfirm.name}"? This action cannot be
                undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  disabled={deleteLoading}
                  className="flex-1 px-4 py-2.5 bg-background border border-border rounded-xl text-sm font-medium text-foreground hover:bg-border/50 transition-colors cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleteLoading}
                  className="flex-1 px-4 py-2.5 bg-red-500 text-white rounded-xl text-sm font-medium hover:bg-red-600 transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {deleteLoading ? (
                    <>
                      <LoadingSpinner size="sm" color="white" />
                      Deleting...
                    </>
                  ) : (
                    'Delete'
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}