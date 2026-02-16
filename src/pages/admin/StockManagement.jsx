import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiPlus, FiSearch, FiX, FiPackage, FiTruck,
  FiShoppingCart, FiArrowUpRight, FiArrowDownRight,
  FiUsers, FiCheck, FiClock, FiFilter
} from 'react-icons/fi'
import { stockLogs as initialStockLogs, products, formatPrice, formatDate } from '../../data'

const typeConfig = {
  added: { label: 'Stock Added', icon: <FiArrowDownRight />, color: 'bg-success/10 text-success', iconBg: 'bg-success/10' },
  sold: { label: 'Sold', icon: <FiShoppingCart />, color: 'bg-info/10 text-info', iconBg: 'bg-info/10' },
  transferred: { label: 'Transferred', icon: <FiUsers />, color: 'bg-warning/10 text-warning', iconBg: 'bg-warning/10' },
}

const emptyStockForm = {
  productId: '',
  type: 'added',
  quantity: '',
  reference: '',
  person: '',
  notes: '',
}

export default function StockManagement() {
  const [stockLogs, setStockLogs] = useState(initialStockLogs)
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterSettled, setFilterSettled] = useState('all')
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState(emptyStockForm)

  const filtered = stockLogs.filter((log) => {
    const matchesSearch = log.productName.toLowerCase().includes(search.toLowerCase()) ||
      (log.person && log.person.toLowerCase().includes(search.toLowerCase()))
    const matchesType = filterType === 'all' || log.type === filterType
    const matchesSettled = filterSettled === 'all' ||
      (filterSettled === 'settled' && log.settled) ||
      (filterSettled === 'unsettled' && !log.settled)
    return matchesSearch && matchesType && matchesSettled
  }).sort((a, b) => new Date(b.date) - new Date(a.date))

  const totalAdded = stockLogs.filter(l => l.type === 'added').reduce((sum, l) => sum + l.quantity, 0)
  const totalSold = stockLogs.filter(l => l.type === 'sold').reduce((sum, l) => sum + l.quantity, 0)
  const totalTransferred = stockLogs.filter(l => l.type === 'transferred').reduce((sum, l) => sum + l.quantity, 0)
  const unsettledAmount = stockLogs.filter(l => l.type === 'transferred' && !l.settled).reduce((sum, l) => sum + l.amount, 0)

  const openModal = (type = 'added') => {
    setForm({ ...emptyStockForm, type })
    setModalOpen(true)
  }

  const handleSave = (e) => {
    e.preventDefault()
    const product = products.find(p => p.id === Number(form.productId))
    const newLog = {
      id: Date.now(),
      productId: Number(form.productId),
      productName: product?.name || 'Unknown Product',
      type: form.type,
      quantity: Number(form.quantity),
      date: new Date().toISOString().split('T')[0],
      reference: form.reference || `REF-${Date.now()}`,
      person: form.type === 'transferred' ? form.person : null,
      amount: Number(form.quantity) * (product?.price || 0),
      settled: form.type !== 'transferred',
      notes: form.notes,
    }
    setStockLogs((prev) => [newLog, ...prev])
    setModalOpen(false)
  }

  const toggleSettled = (id) => {
    setStockLogs((prev) =>
      prev.map((log) =>
        log.id === id ? { ...log, settled: !log.settled } : log
      )
    )
  }

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const inputClasses =
    'w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm text-foreground placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all'

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Stock Management</h2>
          <p className="text-sm text-muted mt-1">Track stock movements and transfers</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => openModal('added')}
            className="flex items-center gap-2 px-4 py-2.5 bg-success text-white rounded-xl text-sm font-medium hover:bg-success/90 transition-colors cursor-pointer"
          >
            <FiPlus className="w-4 h-4" />
            Add Stock
          </button>
          <button
            onClick={() => openModal('transferred')}
            className="flex items-center gap-2 px-4 py-2.5 bg-warning text-white rounded-xl text-sm font-medium hover:bg-warning/90 transition-colors cursor-pointer"
          >
            <FiTruck className="w-4 h-4" />
            Transfer
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Added', value: totalAdded, icon: <FiArrowDownRight />, color: 'success' },
          { label: 'Total Sold', value: totalSold, icon: <FiShoppingCart />, color: 'info' },
          { label: 'Total Transferred', value: totalTransferred, icon: <FiUsers />, color: 'warning' },
          { label: 'Unsettled Amount', value: formatPrice(unsettledAmount), icon: <FiClock />, color: 'danger' },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-surface border border-border rounded-2xl p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 bg-${stat.color}/10 rounded-xl flex items-center justify-center`}>
                <span className={`text-${stat.color}`}>{stat.icon}</span>
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
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
            placeholder="Search by product or person..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`${inputClasses} pl-11`}
          />
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className={`${inputClasses} max-w-[160px]`}
        >
          <option value="all">All Types</option>
          <option value="added">Added</option>
          <option value="sold">Sold</option>
          <option value="transferred">Transferred</option>
        </select>
        <select
          value={filterSettled}
          onChange={(e) => setFilterSettled(e.target.value)}
          className={`${inputClasses} max-w-[160px]`}
        >
          <option value="all">All Status</option>
          <option value="settled">Settled</option>
          <option value="unsettled">Unsettled</option>
        </select>
      </div>

      {/* Stock Logs Table */}
      <div className="bg-surface border border-border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-background">
                {['Date', 'Product', 'Type', 'Quantity', 'Person/Reference', 'Amount', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="text-left text-xs font-semibold text-muted uppercase tracking-wider px-6 py-4">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((log, index) => {
                const config = typeConfig[log.type]
                return (
                  <motion.tr
                    key={log.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className="hover:bg-background/50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm text-muted whitespace-nowrap">
                      {formatDate(log.date)}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-foreground truncate max-w-[180px]">
                        {log.productName}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full ${config.color}`}>
                        {config.icon}
                        {config.label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-semibold text-foreground">{log.quantity}</span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-foreground">
                        {log.person || log.reference}
                      </p>
                      {log.person && (
                        <p className="text-xs text-muted">{log.reference}</p>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-foreground whitespace-nowrap">
                      {formatPrice(log.amount)}
                    </td>
                    <td className="px-6 py-4">
                      {log.type === 'transferred' ? (
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full ${
                          log.settled ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'
                        }`}>
                          {log.settled ? <FiCheck className="w-3 h-3" /> : <FiClock className="w-3 h-3" />}
                          {log.settled ? 'Settled' : 'Pending'}
                        </span>
                      ) : (
                        <span className="text-sm text-muted">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {log.type === 'transferred' && !log.settled && (
                        <button
                          onClick={() => toggleSettled(log.id)}
                          className="px-3 py-1.5 bg-success/10 text-success text-xs font-medium rounded-lg hover:bg-success/20 transition-colors cursor-pointer"
                        >
                          Mark Settled
                        </button>
                      )}
                    </td>
                  </motion.tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="p-12 text-center">
            <FiPackage className="w-12 h-12 text-muted mx-auto mb-4" />
            <p className="text-muted">No stock logs found</p>
          </div>
        )}
      </div>

      {/* Add Stock / Transfer Modal */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-secondary/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-surface border border-border rounded-2xl w-full max-w-md"
            >
              <div className="p-6 border-b border-border flex items-center justify-between">
                <h3 className="text-lg font-bold text-foreground">
                  {form.type === 'added' ? 'Add Stock' : form.type === 'transferred' ? 'Transfer Stock' : 'Record Sale'}
                </h3>
                <button
                  onClick={() => setModalOpen(false)}
                  className="p-2 rounded-lg hover:bg-background text-muted transition-colors cursor-pointer"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSave} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Type</label>
                  <select
                    name="type"
                    value={form.type}
                    onChange={handleChange}
                    className={inputClasses}
                  >
                    <option value="added">Add Stock</option>
                    <option value="sold">Record Sale</option>
                    <option value="transferred">Transfer to Person/Shop</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Product</label>
                  <select
                    name="productId"
                    value={form.productId}
                    onChange={handleChange}
                    required
                    className={inputClasses}
                  >
                    <option value="">Select Product</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>{p.name} (Stock: {p.stock})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Quantity</label>
                  <input
                    type="number"
                    name="quantity"
                    value={form.quantity}
                    onChange={handleChange}
                    required
                    min="1"
                    className={inputClasses}
                    placeholder="Enter quantity"
                  />
                </div>

                {form.type === 'transferred' && (
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Person / Shop Name</label>
                    <input
                      type="text"
                      name="person"
                      value={form.person}
                      onChange={handleChange}
                      required
                      className={inputClasses}
                      placeholder="Enter name"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Reference (Optional)</label>
                  <input
                    type="text"
                    name="reference"
                    value={form.reference}
                    onChange={handleChange}
                    className={inputClasses}
                    placeholder="PO-2024-001"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Notes (Optional)</label>
                  <textarea
                    name="notes"
                    value={form.notes}
                    onChange={handleChange}
                    rows={2}
                    className={inputClasses}
                    placeholder="Additional notes..."
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="flex-1 px-4 py-2.5 bg-background border border-border rounded-xl text-sm font-medium text-foreground hover:bg-border/50 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={`flex-1 px-4 py-2.5 text-white rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                      form.type === 'added' ? 'bg-success hover:bg-success/90' :
                      form.type === 'transferred' ? 'bg-warning hover:bg-warning/90' :
                      'bg-info hover:bg-info/90'
                    }`}
                  >
                    {form.type === 'added' ? 'Add Stock' : form.type === 'transferred' ? 'Transfer' : 'Record'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}