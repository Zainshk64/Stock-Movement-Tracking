import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiPlus,
  FiSearch,
  FiX,
  FiPackage,
  FiTruck,
  FiShoppingCart,
  FiArrowDownRight,
  FiUsers,
  FiCheck,
  FiClock,
  FiRefreshCw,
  FiAlertCircle,
} from 'react-icons/fi';
import AlertMessage from '../../components/AlertMessage';
import LoadingSpinner from '../../components/LoadingSpinner';
import stockApi from '../../services/stockApi';
import adminApi from '../../services/adminApi';

// Type configuration for badges
const typeConfig = {
  added: {
    label: 'Stock Added',
    icon: <FiArrowDownRight className="w-3 h-3" />,
    color: 'bg-green-100 text-green-600 ',
    iconBg: 'bg-green-100 ',
    iconColor: 'text-green-600 ',
  },
  sold: {
    label: 'Sold',
    icon: <FiShoppingCart className="w-3 h-3" />,
    color: 'bg-blue-100 text-blue-600 ',
    iconBg: 'bg-blue-100 ',
    iconColor: 'text-blue-600 ',
  },
  transferred: {
    label: 'Transferred',
    icon: <FiUsers className="w-3 h-3" />,
    color: 'bg-yellow-100 text-yellow-600 ',
    iconBg: 'bg-yellow-100 ',
    iconColor: 'text-yellow-600 ',
  },
};

// Empty form template
const emptyStockForm = {
  productId: '',
  type: 'added',
  quantity: '',
  reference: '',
  person: '',
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

export default function StockManagement() {
  // Data states
  const [stockLogs, setStockLogs] = useState([]);
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState({
    totalAdded: 0,
    totalSold: 0,
    totalTransferred: 0,
    unsettledAmount: 0,
  });

  // Loading states
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [settleLoading, setSettleLoading] = useState(null);

  // Filter states
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterSettled, setFilterSettled] = useState('all');

  // Pagination
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
  });

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyStockForm);

  // Alert state
  const [alert, setAlert] = useState({ type: '', message: '' });

  // Fetch all data on mount
  useEffect(() => {
    fetchProducts();
    fetchStats();
    fetchStockLogs();
  }, []);

  // Refetch logs when filters change
  useEffect(() => {
    fetchStockLogs();
  }, [filterType, filterSettled, pagination.page]);

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

  // Fetch stock statistics
  const fetchStats = async () => {
    try {
      setStatsLoading(true);
      const response = await stockApi.getStockStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setStatsLoading(false);
    }
  };

  // Fetch stock logs
  const fetchStockLogs = async () => {
    try {
      setLoading(true);
      const response = await stockApi.getStockLogs({
        type: filterType,
        settled: filterSettled,
        page: pagination.page,
        limit: 20,
      });
      if (response.success) {
        setStockLogs(response.data);
        setPagination({
          page: response.currentPage,
          totalPages: response.totalPages,
          total: response.total,
        });
      }
    } catch (error) {
      setAlert({ type: 'error', message: error.message || 'Failed to fetch stock logs' });
    } finally {
      setLoading(false);
    }
  };

  // Filter logs by search (client-side)
  const filteredLogs = stockLogs.filter((log) => {
    const searchLower = search.toLowerCase();
    return (
      log.productName?.toLowerCase().includes(searchLower) ||
      log.person?.toLowerCase().includes(searchLower) ||
      log.reference?.toLowerCase().includes(searchLower)
    );
  });

  // Open modal with type
  const openModal = (type = 'added') => {
    setForm({ ...emptyStockForm, type });
    setModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setModalOpen(false);
    setForm(emptyStockForm);
  };

  // Handle form change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle form submit
  const handleSave = async (e) => {
    e.preventDefault();
    setFormLoading(true);

    try {
      // Prepare data
      const data = {
        productId: form.productId,
        quantity: Number(form.quantity),
        reference: form.reference || undefined,
        notes: form.notes || undefined,
      };

      // Add person for transfers
      if (form.type === 'transferred') {
        data.person = form.person;
      }

      let response;

      // Call appropriate API based on type
      switch (form.type) {
        case 'added':
          response = await stockApi.addStock(data);
          break;
        case 'sold':
          response = await stockApi.recordSale(data);
          break;
        case 'transferred':
          response = await stockApi.transferStock(data);
          break;
        default:
          throw new Error('Invalid type');
      }

      if (response.success) {
        setAlert({
          type: 'success',
          message: response.message || 'Operation successful!',
        });
        closeModal();
        // Refresh data
        fetchStockLogs();
        fetchStats();
        fetchProducts(); // Refresh product stock counts
      }
    } catch (error) {
      setAlert({
        type: 'error',
        message: error.message || 'Operation failed',
      });
    } finally {
      setFormLoading(false);
    }
  };

  // Handle settle transfer
  const handleSettle = async (id) => {
    setSettleLoading(id);

    try {
      const response = await stockApi.settleTransfer(id);
      if (response.success) {
        setAlert({
          type: 'success',
          message: 'Transfer marked as settled!',
        });
        // Refresh data
        fetchStockLogs();
        fetchStats();
      }
    } catch (error) {
      setAlert({
        type: 'error',
        message: error.message || 'Failed to settle transfer',
      });
    } finally {
      setSettleLoading(null);
    }
  };

  // Refresh all data
  const refreshData = () => {
    fetchProducts();
    fetchStats();
    fetchStockLogs();
  };

  const inputClasses =
    'w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm text-foreground placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed';

  // Stats cards data
  const statsCards = [
    {
      label: 'Total Added',
      value: stats.totalAdded,
      icon: <FiArrowDownRight className="w-5 h-5" />,
      bgColor: 'bg-green-100 ',
      textColor: 'text-green-600 ',
    },
    {
      label: 'Total Sold',
      value: stats.totalSold,
      icon: <FiShoppingCart className="w-5 h-5" />,
      bgColor: 'bg-blue-100 ',
      textColor: 'text-blue-600 ',
    },
    {
      label: 'Total Transferred',
      value: stats.totalTransferred,
      icon: <FiUsers className="w-5 h-5" />,
      bgColor: 'bg-yellow-100 ',
      textColor: 'text-yellow-600 ',
    },
    {
      label: 'Unsettled Amount',
      value: formatPrice(stats.unsettledAmount),
      icon: <FiClock className="w-5 h-5" />,
      bgColor: 'bg-red-100 ',
      textColor: 'text-red-600 ',
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
          <h2 className="text-2xl font-bold text-foreground">Stock Management</h2>
          <p className="text-sm text-muted mt-1">Track stock movements and transfers</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={refreshData}
            className="flex items-center gap-2 px-4 py-2.5 bg-background border border-border rounded-xl text-sm font-medium text-foreground hover:bg-border/50 transition-colors cursor-pointer"
            title="Refresh"
          >
            <FiRefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
          <button
            onClick={() => openModal('sold')}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-500 text-white rounded-xl text-sm font-medium hover:bg-blue-600 transition-colors cursor-pointer"
          >
            <FiShoppingCart className="w-4 h-4" />
            <span className="hidden sm:inline">Record Sale</span>
          </button>
          <button
            onClick={() => openModal('transferred')}
            className="flex items-center gap-2 px-4 py-2.5 bg-yellow-500 text-white rounded-xl text-sm font-medium hover:bg-yellow-600 transition-colors cursor-pointer"
          >
            <FiTruck className="w-4 h-4" />
            <span className="hidden sm:inline">Transfer</span>
          </button>
          <button
            onClick={() => openModal('added')}
            className="flex items-center gap-2 px-4 py-2.5 bg-green-500 text-white rounded-xl text-sm font-medium hover:bg-green-600 transition-colors cursor-pointer"
          >
            <FiPlus className="w-4 h-4" />
            Add Stock
          </button>
        </div>
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
              <div
                className={`w-10 h-10 ${stat.bgColor} rounded-xl flex items-center justify-center`}
              >
                <span className={stat.textColor}>{stat.icon}</span>
              </div>
              {statsLoading && (
                <LoadingSpinner size="sm" />
              )}
            </div>
            <p className="text-2xl font-bold text-foreground">
              {statsLoading ? '...' : stat.value}
            </p>
            <p className="text-sm text-muted">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-sm">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="text"
            placeholder="Search by product, person, or reference..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`${inputClasses} pl-11`}
          />
        </div>
        <select
          value={filterType}
          onChange={(e) => {
            setFilterType(e.target.value);
            setPagination((prev) => ({ ...prev, page: 1 }));
          }}
          className={`${inputClasses} sm:max-w-[160px]`}
        >
          <option value="all">All Types</option>
          <option value="added">Added</option>
          <option value="sold">Sold</option>
          <option value="transferred">Transferred</option>
        </select>
        <select
          value={filterSettled}
          onChange={(e) => {
            setFilterSettled(e.target.value);
            setPagination((prev) => ({ ...prev, page: 1 }));
          }}
          className={`${inputClasses} sm:max-w-[160px]`}
        >
          <option value="all">All Status</option>
          <option value="settled">Settled</option>
          <option value="unsettled">Unsettled</option>
        </select>
      </div>

      {/* Stock Logs Table */}
      <div className="bg-surface border border-border rounded-2xl overflow-hidden">
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
                    {[
                      'Date',
                      'Product',
                      'Type',
                      'Quantity',
                      'Person/Reference',
                      'Amount',
                      'Status',
                      'Actions',
                    ].map((h) => (
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
                  {filteredLogs.map((log, index) => {
                    const config = typeConfig[log.type];
                    return (
                      <motion.tr
                        key={log._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.03 }}
                        className="hover:bg-background/50 transition-colors"
                      >
                        <td className="px-6 py-4 text-sm text-muted whitespace-nowrap">
                          {formatDate(log.createdAt)}
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm font-medium text-foreground truncate max-w-[180px]">
                            {log.productName}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full ${config.color}`}
                          >
                            {config.icon}
                            {config.label}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-semibold text-foreground">
                            {log.type === 'added' ? '+' : '-'}
                            {log.quantity}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-foreground">
                            {log.person || log.reference || '—'}
                          </p>
                          {log.person && log.reference && (
                            <p className="text-xs text-muted">{log.reference}</p>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm font-semibold text-foreground whitespace-nowrap">
                          {formatPrice(log.amount)}
                        </td>
                        <td className="px-6 py-4">
                          {log.type === 'transferred' ? (
                            <span
                              className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full ${
                                log.settled
                                  ? 'bg-green-100 text-green-600 '
                                  : 'bg-red-100 text-red-600 '
                              }`}
                            >
                              {log.settled ? (
                                <FiCheck className="w-3 h-3" />
                              ) : (
                                <FiClock className="w-3 h-3" />
                              )}
                              {log.settled ? 'Settled' : 'Pending'}
                            </span>
                          ) : (
                            <span className="text-sm text-muted">—</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {log.type === 'transferred' && !log.settled && (
                            <button
                              onClick={() => handleSettle(log._id)}
                              disabled={settleLoading === log._id}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-100 text-green-600 text-xs font-medium rounded-lg hover:bg-green-200 transition-colors cursor-pointer disabled:opacity-50"
                            >
                              {settleLoading === log._id ? (
                                <LoadingSpinner size="sm" />
                              ) : (
                                <>
                                  <FiCheck className="w-3 h-3" />
                                  Mark Settled
                                </>
                              )}
                            </button>
                          )}
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Empty State */}
            {filteredLogs.length === 0 && (
              <div className="p-12 text-center">
                <FiPackage className="w-12 h-12 text-muted mx-auto mb-4" />
                <p className="text-muted">
                  {search
                    ? 'No stock logs found matching your search'
                    : 'No stock logs yet'}
                </p>
              </div>
            )}

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-border">
                <p className="text-sm text-muted">
                  Showing {filteredLogs.length} of {pagination.total} entries
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
                    className="px-4 py-2 bg-background border border-border rounded-lg text-sm font-medium text-foreground hover:bg-border/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    Previous
                  </button>
                  <span className="px-4 py-2 text-sm text-muted">
                    Page {pagination.page} of {pagination.totalPages}
                  </span>
                  <button
                    onClick={() =>
                      setPagination((prev) => ({
                        ...prev,
                        page: Math.min(prev.totalPages, prev.page + 1),
                      }))
                    }
                    disabled={pagination.page === pagination.totalPages}
                    className="px-4 py-2 bg-background border border-border rounded-lg text-sm font-medium text-foreground hover:bg-border/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Add Stock / Transfer / Sale Modal */}
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
              className="bg-surface border border-border rounded-2xl w-full max-w-md"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      form.type === 'added'
                        ? 'bg-green-100 '
                        : form.type === 'sold'
                        ? 'bg-blue-100 '
                        : 'bg-yellow-100 '
                    }`}
                  >
                    {form.type === 'added' ? (
                      <FiPlus className="w-5 h-5 text-green-600 " />
                    ) : form.type === 'sold' ? (
                      <FiShoppingCart className="w-5 h-5 text-blue-600 " />
                    ) : (
                      <FiTruck className="w-5 h-5 text-yellow-600 " />
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-foreground">
                    {form.type === 'added'
                      ? 'Add Stock'
                      : form.type === 'sold'
                      ? 'Record Sale'
                      : 'Transfer Stock'}
                  </h3>
                </div>
                <button
                  onClick={closeModal}
                  disabled={formLoading}
                  className="p-2 rounded-lg hover:bg-background text-muted transition-colors cursor-pointer disabled:opacity-50"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <form onSubmit={handleSave} className="p-6 space-y-4">
                {/* Type Selection */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Type
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { value: 'added', label: 'Add Stock', color: 'green' },
                      { value: 'sold', label: 'Record Sale', color: 'blue' },
                      { value: 'transferred', label: 'Transfer', color: 'yellow' },
                    ].map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setForm({ ...form, type: option.value })}
                        disabled={formLoading}
                        className={`px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                          form.type === option.value
                            ? option.color === 'green'
                              ? 'bg-green-500 text-white'
                              : option.color === 'blue'
                              ? 'bg-blue-500 text-white'
                              : 'bg-yellow-500 text-white'
                            : 'bg-background border border-border text-foreground hover:bg-border/50'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

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
                    {products.map((p) => (
                      <option key={p._id} value={p._id}>
                        {p.name} (Stock: {p.stock})
                      </option>
                    ))}
                  </select>
                  {products.length === 0 && (
                    <p className="text-xs text-muted mt-1 flex items-center gap-1">
                      <FiAlertCircle className="w-3 h-3" />
                      No products available. Add products first.
                    </p>
                  )}
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

                {/* Person/Shop (for transfers) */}
                {form.type === 'transferred' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <label className="block text-sm font-medium text-foreground mb-1.5">
                      Person / Shop Name *
                    </label>
                    <input
                      type="text"
                      name="person"
                      value={form.person}
                      onChange={handleChange}
                      required={form.type === 'transferred'}
                      disabled={formLoading}
                      className={inputClasses}
                      placeholder="Enter person or shop name"
                    />
                  </motion.div>
                )}

                {/* Reference */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Reference (Optional)
                  </label>
                  <input
                    type="text"
                    name="reference"
                    value={form.reference}
                    onChange={handleChange}
                    disabled={formLoading}
                    className={inputClasses}
                    placeholder="PO-2024-001 or Invoice number"
                  />
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
                    onClick={closeModal}
                    disabled={formLoading}
                    className="flex-1 px-4 py-2.5 bg-background border border-border rounded-xl text-sm font-medium text-foreground hover:bg-border/50 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={formLoading || products.length === 0}
                    className={`flex-1 px-4 py-2.5 text-white rounded-xl text-sm font-medium transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 ${
                      form.type === 'added'
                        ? 'bg-green-500 hover:bg-green-600'
                        : form.type === 'sold'
                        ? 'bg-blue-500 hover:bg-blue-600'
                        : 'bg-yellow-500 hover:bg-yellow-600'
                    }`}
                  >
                    {formLoading ? (
                      <>
                        <LoadingSpinner size="sm" color="white" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <FiCheck className="w-4 h-4" />
                        {form.type === 'added'
                          ? 'Add Stock'
                          : form.type === 'sold'
                          ? 'Record Sale'
                          : 'Transfer'}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}