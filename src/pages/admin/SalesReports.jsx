import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiCalendar,
  FiDollarSign,
  FiShoppingBag,
  FiTrendingUp,
  FiArrowUp,
  FiArrowDown,
  FiDownload,
  FiFilter,
  FiPlus,
  FiTrash2,
  FiX,
  FiCheck,
  FiRefreshCw,
  FiAlertTriangle,
  FiUser,
  FiCreditCard,
} from 'react-icons/fi';
import AlertMessage from '../../components/AlertMessage';
import LoadingSpinner from '../../components/LoadingSpinner';
import salesApi from '../../services/salesApi';
import adminApi from '../../services/adminApi';

// Period options
const periods = [
  { key: 'daily', label: 'Today' },
  { key: 'weekly', label: 'This Week' },
  { key: 'monthly', label: 'This Month' },
  { key: 'all', label: 'All Time' },
];

// Payment methods
const paymentMethods = [
  { value: 'cash', label: 'Cash' },
  { value: 'card', label: 'Card' },
  { value: 'online', label: 'Online' },
  { value: 'credit', label: 'Credit' },
];

// Empty form
const emptySaleForm = {
  productId: '',
  quantity: '',
  customer: '',
  paymentMethod: 'cash',
  notes: '',
};

// Format price helper
const formatPrice = (price) => {
  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    minimumFractionDigits: 0,
  }).format(price);
};

// Format date helper
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export default function SalesReports() {
  // Data states
  const [sales, setSales] = useState([]);
  const [products, setProducts] = useState([]);
  const [reports, setReports] = useState({
    summary: { totalRevenue: 0, totalOrders: 0, totalUnits: 0 },
    productWiseSales: [],
    dailyBreakdown: [],
  });

  // Loading states
  const [loading, setLoading] = useState(true);
  const [reportsLoading, setReportsLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(null);

  // Filter states
  const [period, setPeriod] = useState('all');
  const [productFilter, setProductFilter] = useState('all');

  // Pagination
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
  });

  // Modal states
  const [saleModalOpen, setSaleModalOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [form, setForm] = useState(emptySaleForm);

  // Alert state
  const [alert, setAlert] = useState({ type: '', message: '' });

  // Fetch all data on mount and when period changes
  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    fetchReports();
    fetchSales();
  }, [period]);

  useEffect(() => {
    fetchSales();
  }, [productFilter, pagination.page]);

  // Clear alert after 5 seconds
  useEffect(() => {
    if (alert.message) {
      const timer = setTimeout(() => {
        setAlert({ type: '', message: '' });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  // Fetch products for dropdown
  const fetchProducts = async () => {
    try {
      const response = await adminApi.getAllProducts();
      if (response.success) {
        setProducts(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
  };

  // Fetch sales reports
  const fetchReports = async () => {
    try {
      setReportsLoading(true);
      const response = await salesApi.getSalesReports(period);
      if (response.success) {
        setReports(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch reports:', error);
    } finally {
      setReportsLoading(false);
    }
  };

  // Fetch sales list
  const fetchSales = async () => {
    try {
      setLoading(true);

      // Calculate date range based on period
      const params = {
        page: pagination.page,
        limit: 20,
      };

      if (productFilter !== 'all') {
        params.product = productFilter;
      }

      // Add date filters based on period
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      if (period === 'daily') {
        params.startDate = today.toISOString();
      } else if (period === 'weekly') {
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        params.startDate = weekAgo.toISOString();
      } else if (period === 'monthly') {
        const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
        params.startDate = monthAgo.toISOString();
      }

      const response = await salesApi.getSales(params);
      if (response.success) {
        setSales(response.data);
        setPagination({
          page: response.currentPage,
          totalPages: response.totalPages,
          total: response.total,
        });
      }
    } catch (error) {
      setAlert({ type: 'error', message: error.message || 'Failed to fetch sales' });
    } finally {
      setLoading(false);
    }
  };

  // Handle form change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle create sale
  const handleCreateSale = async (e) => {
    e.preventDefault();
    setFormLoading(true);

    try {
      const data = {
        productId: form.productId,
        quantity: Number(form.quantity),
        customer: form.customer || 'Walk-in',
        paymentMethod: form.paymentMethod,
        notes: form.notes || undefined,
      };

      const response = await salesApi.createSale(data);
      if (response.success) {
        setAlert({ type: 'success', message: 'Sale recorded successfully!' });
        setSaleModalOpen(false);
        setForm(emptySaleForm);
        fetchSales();
        fetchReports();
        fetchProducts();
      }
    } catch (error) {
      setAlert({ type: 'error', message: error.message || 'Failed to create sale' });
    } finally {
      setFormLoading(false);
    }
  };

  // Handle delete sale
  const handleDeleteSale = async () => {
    if (!deleteConfirm) return;
    setDeleteLoading(deleteConfirm._id);

    try {
      const response = await salesApi.deleteSale(deleteConfirm._id);
      if (response.success) {
        setAlert({ type: 'success', message: 'Sale deleted and stock restored!' });
        setDeleteConfirm(null);
        fetchSales();
        fetchReports();
        fetchProducts();
      }
    } catch (error) {
      setAlert({ type: 'error', message: error.message || 'Failed to delete sale' });
    } finally {
      setDeleteLoading(null);
    }
  };

  // Refresh all data
  const refreshData = () => {
    fetchProducts();
    fetchReports();
    fetchSales();
  };

  // Calculate average order value
  const avgOrderValue = useMemo(() => {
    if (reports.summary.totalOrders === 0) return 0;
    return reports.summary.totalRevenue / reports.summary.totalOrders;
  }, [reports.summary]);

  // Get payment method badge color
  const getPaymentBadge = (method) => {
    const colors = {
      cash: 'bg-green-100 text-green-600',
      card: 'bg-blue-100 text-blue-600',
      online: 'bg-purple-100 text-purple-600',
      credit: 'bg-yellow-100 text-yellow-600',
    };
    return colors[method] || 'bg-gray-100 text-gray-600';
  };

  const inputClasses =
    'w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm text-foreground placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed';

  // Stats cards data
  const statsCards = [
    {
      label: 'Total Revenue',
      value: formatPrice(reports.summary.totalRevenue),
      icon: <FiDollarSign className="w-5 h-5" />,
      bgColor: 'bg-green-100',
      textColor: 'text-green-600',
    },
    {
      label: 'Total Orders',
      value: reports.summary.totalOrders,
      icon: <FiShoppingBag className="w-5 h-5" />,
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600',
    },
    {
      label: 'Units Sold',
      value: reports.summary.totalUnits,
      icon: <FiTrendingUp className="w-5 h-5" />,
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-600',
    },
    {
      label: 'Avg. Order Value',
      value: formatPrice(avgOrderValue),
      icon: <FiCalendar className="w-5 h-5" />,
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-600',
    },
  ];

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
          <h2 className="text-2xl font-bold text-foreground">Sales Reports</h2>
          <p className="text-sm text-muted mt-1">Track revenue and sales performance</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={refreshData}
            className="flex items-center gap-2 px-4 py-2.5 bg-background border border-border rounded-xl text-sm font-medium text-foreground hover:bg-border/50 transition-colors cursor-pointer"
          >
            <FiRefreshCw className={`w-4 h-4 ${loading || reportsLoading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => setSaleModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors cursor-pointer"
          >
            <FiPlus className="w-4 h-4" />
            New Sale
          </button>
        </div>
      </div>

      {/* Period Tabs */}
      <div className="flex flex-wrap gap-2">
        {periods.map((p) => (
          <button
            key={p.key}
            onClick={() => {
              setPeriod(p.key);
              setPagination((prev) => ({ ...prev, page: 1 }));
            }}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${
              period === p.key
                ? 'bg-primary text-white shadow-lg shadow-primary/20'
                : 'bg-surface border border-border text-muted hover:text-foreground hover:bg-background'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Stats Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-surface border border-border rounded-2xl p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 ${stat.bgColor} rounded-xl flex items-center justify-center`}>
                <span className={stat.textColor}>{stat.icon}</span>
              </div>
              {reportsLoading && <LoadingSpinner size="sm" />}
            </div>
            <p className="text-2xl font-bold text-foreground">
              {reportsLoading ? '...' : stat.value}
            </p>
            <p className="text-sm text-muted">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Sales Table */}
        <div className="lg:col-span-2 space-y-4">
          {/* Product Filter */}
          <div className="flex items-center gap-4">
            <FiFilter className="text-muted" />
            <select
              value={productFilter}
              onChange={(e) => {
                setProductFilter(e.target.value);
                setPagination((prev) => ({ ...prev, page: 1 }));
              }}
              className={`${inputClasses} max-w-[250px]`}
            >
              <option value="all">All Products</option>
              {products.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sales Table */}
          <div className="bg-surface border border-border rounded-2xl overflow-hidden">
            <div className="p-5 border-b border-border flex items-center justify-between">
              <h3 className="text-lg font-bold text-foreground">Recent Sales</h3>
              <span className="text-sm text-muted">{pagination.total} total</span>
            </div>

            {loading ? (
              <div className="flex items-center justify-center h-64">
                <LoadingSpinner size="xl" />
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-background">
                        {['Date', 'Product', 'Customer', 'Payment', 'Qty', 'Amount', 'Actions'].map(
                          (h) => (
                            <th
                              key={h}
                              className="text-left text-xs font-semibold text-muted uppercase tracking-wider px-6 py-3"
                            >
                              {h}
                            </th>
                          )
                        )}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {sales.map((sale, index) => (
                        <motion.tr
                          key={sale._id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.03 }}
                          className="hover:bg-background/50 transition-colors"
                        >
                          <td className="px-6 py-4 text-sm text-muted whitespace-nowrap">
                            {formatDate(sale.createdAt)}
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-sm font-medium text-foreground truncate max-w-[150px]">
                              {sale.productName}
                            </p>
                          </td>
                          <td className="px-6 py-4 text-sm text-muted whitespace-nowrap">
                            {sale.customer}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${getPaymentBadge(
                                sale.paymentMethod
                              )}`}
                            >
                              {sale.paymentMethod}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-foreground">
                            {sale.quantity}
                          </td>
                          <td className="px-6 py-4 text-sm font-semibold text-foreground whitespace-nowrap">
                            {formatPrice(sale.amount)}
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => setDeleteConfirm(sale)}
                              className="p-2 rounded-lg hover:bg-red-100 text-red-500 transition-colors cursor-pointer"
                              title="Delete"
                            >
                              <FiTrash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {sales.length === 0 && (
                  <div className="p-12 text-center">
                    <FiShoppingBag className="w-12 h-12 text-muted mx-auto mb-4" />
                    <p className="text-muted">No sales found for this period</p>
                  </div>
                )}

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="flex items-center justify-between px-6 py-4 border-t border-border">
                    <p className="text-sm text-muted">
                      Page {pagination.page} of {pagination.totalPages}
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          setPagination((prev) => ({
                            ...prev,
                            page: Math.max(1, prev.page - 1),
                          }))
                        }
                        disabled={pagination.page === 1}
                        className="px-3 py-1.5 bg-background border border-border rounded-lg text-sm font-medium text-foreground hover:bg-border/50 transition-colors disabled:opacity-50 cursor-pointer"
                      >
                        Previous
                      </button>
                      <button
                        onClick={() =>
                          setPagination((prev) => ({
                            ...prev,
                            page: Math.min(prev.totalPages, prev.page + 1),
                          }))
                        }
                        disabled={pagination.page === pagination.totalPages}
                        className="px-3 py-1.5 bg-background border border-border rounded-lg text-sm font-medium text-foreground hover:bg-border/50 transition-colors disabled:opacity-50 cursor-pointer"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Product-wise Sales */}
          <div className="bg-surface border border-border rounded-2xl overflow-hidden">
            <div className="p-5 border-b border-border">
              <h3 className="text-lg font-bold text-foreground">Top Products</h3>
            </div>
            <div className="p-4 space-y-3">
              {reportsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <LoadingSpinner size="lg" />
                </div>
              ) : reports.productWiseSales.length > 0 ? (
                reports.productWiseSales.slice(0, 5).map((product, index) => {
                  const maxRevenue = reports.productWiseSales[0]?.totalRevenue || 1;
                  const percentage = (product.totalRevenue / maxRevenue) * 100;
                  return (
                    <motion.div
                      key={product._id || index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-foreground truncate max-w-[150px]">
                          {product.productName}
                        </p>
                        <p className="text-sm font-bold text-foreground">
                          {formatPrice(product.totalRevenue)}
                        </p>
                      </div>
                      <div className="h-2 bg-background rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ delay: index * 0.1, duration: 0.5 }}
                          className="h-full bg-primary rounded-full"
                        />
                      </div>
                      <p className="text-xs text-muted">
                        {product.totalQuantity} units • {product.totalOrders} orders
                      </p>
                    </motion.div>
                  );
                })
              ) : (
                <p className="text-sm text-muted text-center py-4">No data available</p>
              )}
            </div>
          </div>

          {/* Daily Breakdown */}
          <div className="bg-surface border border-border rounded-2xl overflow-hidden">
            <div className="p-5 border-b border-border">
              <h3 className="text-lg font-bold text-foreground">Daily Breakdown</h3>
            </div>
            <div className="p-4 space-y-3 max-h-[300px] overflow-y-auto">
              {reportsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <LoadingSpinner size="lg" />
                </div>
              ) : reports.dailyBreakdown.length > 0 ? (
                reports.dailyBreakdown.slice(0, 7).map((day, index) => (
                  <motion.div
                    key={day._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between p-3 bg-background rounded-xl"
                  >
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {formatDate(day._id)}
                      </p>
                      <p className="text-xs text-muted">{day.orders} orders</p>
                    </div>
                    <p className="text-sm font-bold text-green-600">
                      {formatPrice(day.revenue)}
                    </p>
                  </motion.div>
                ))
              ) : (
                <p className="text-sm text-muted text-center py-4">No data available</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Create Sale Modal */}
      <AnimatePresence>
        {saleModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-secondary/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => !formLoading && setSaleModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-surface border border-border rounded-2xl w-full max-w-md"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                    <FiShoppingBag className="w-5 h-5 text-green-600" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground">New Sale</h3>
                </div>
                <button
                  onClick={() => setSaleModalOpen(false)}
                  disabled={formLoading}
                  className="p-2 rounded-lg hover:bg-background text-muted transition-colors cursor-pointer disabled:opacity-50"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <form onSubmit={handleCreateSale} className="p-6 space-y-4">
                {/* Product Selection */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Product *
                  </label>
                  <select
                    name="productId"
                    value={form.productId}
                    onChange={handleChange}
                    required
                    disabled={formLoading}
                    className={inputClasses}
                  >
                    <option value="">Select Product</option>
                    {products
                      .filter((p) => p.stock > 0)
                      .map((p) => (
                        <option key={p._id} value={p._id}>
                          {p.name} (Stock: {p.stock}) - {formatPrice(p.price)}
                        </option>
                      ))}
                  </select>
                </div>

                {/* Quantity */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Quantity *
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    value={form.quantity}
                    onChange={handleChange}
                    required
                    min="1"
                    disabled={formLoading}
                    className={inputClasses}
                    placeholder="Enter quantity"
                  />
                </div>

                {/* Customer Name */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Customer Name
                  </label>
                  <div className="relative">
                    <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
                    <input
                      type="text"
                      name="customer"
                      value={form.customer}
                      onChange={handleChange}
                      disabled={formLoading}
                      className={`${inputClasses} pl-11`}
                      placeholder="Walk-in customer"
                    />
                  </div>
                </div>

                {/* Payment Method */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Payment Method
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {paymentMethods.map((method) => (
                      <button
                        key={method.value}
                        type="button"
                        onClick={() => setForm({ ...form, paymentMethod: method.value })}
                        disabled={formLoading}
                        className={`px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                          form.paymentMethod === method.value
                            ? 'bg-primary text-white'
                            : 'bg-background border border-border text-foreground hover:bg-border/50'
                        }`}
                      >
                        {method.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Notes (Optional)
                  </label>
                  <textarea
                    name="notes"
                    value={form.notes}
                    onChange={handleChange}
                    rows={2}
                    disabled={formLoading}
                    className={inputClasses}
                    placeholder="Additional notes..."
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setSaleModalOpen(false)}
                    disabled={formLoading}
                    className="flex-1 px-4 py-2.5 bg-background border border-border rounded-xl text-sm font-medium text-foreground hover:bg-border/50 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={formLoading || products.filter((p) => p.stock > 0).length === 0}
                    className="flex-1 px-4 py-2.5 bg-green-500 text-white rounded-xl text-sm font-medium hover:bg-green-600 transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {formLoading ? (
                      <>
                        <LoadingSpinner size="sm" color="white" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <FiCheck className="w-4 h-4" />
                        Record Sale
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
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <FiAlertTriangle className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="text-lg font-bold text-foreground text-center mb-2">Delete Sale</h3>
              <p className="text-sm text-muted text-center mb-2">
                Are you sure you want to delete this sale?
              </p>
              <div className="bg-background rounded-xl p-3 mb-4">
                <p className="text-sm font-medium text-foreground">{deleteConfirm.productName}</p>
                <p className="text-xs text-muted">
                  {deleteConfirm.quantity} units • {formatPrice(deleteConfirm.amount)}
                </p>
              </div>
              <p className="text-xs text-yellow-600 text-center mb-4">
                ⚠️ Stock will be restored to inventory
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
                  onClick={handleDeleteSale}
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