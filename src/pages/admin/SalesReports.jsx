import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  FiCalendar, FiDollarSign, FiShoppingBag, FiTrendingUp,
  FiArrowUp, FiArrowDown, FiDownload, FiFilter
} from 'react-icons/fi'
import { salesData, products, formatPrice, formatDate } from '../../data'

const periods = [
  { key: 'daily', label: 'Today' },
  { key: 'weekly', label: 'This Week' },
  { key: 'monthly', label: 'This Month' },
  { key: 'all', label: 'All Time' },
]

export default function SalesReports() {
  const [period, setPeriod] = useState('all')
  const [productFilter, setProductFilter] = useState('all')

  const filterByPeriod = (data) => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)

    return data.filter((sale) => {
      const saleDate = new Date(sale.date)
      if (period === 'daily') return saleDate >= today
      if (period === 'weekly') return saleDate >= weekAgo
      if (period === 'monthly') return saleDate >= monthAgo
      return true
    })
  }

  const filteredSales = useMemo(() => {
    let data = filterByPeriod(salesData)
    if (productFilter !== 'all') {
      data = data.filter(s => s.productId === Number(productFilter))
    }
    return data.sort((a, b) => new Date(b.date) - new Date(a.date))
  }, [period, productFilter])

  const stats = useMemo(() => {
    const totalRevenue = filteredSales.reduce((sum, s) => sum + s.amount, 0)
    const totalOrders = filteredSales.length
    const totalUnits = filteredSales.reduce((sum, s) => sum + s.quantity, 0)
    const avgOrder = totalOrders > 0 ? totalRevenue / totalOrders : 0
    return { totalRevenue, totalOrders, totalUnits, avgOrder }
  }, [filteredSales])

  const productWiseSales = useMemo(() => {
    const grouped = {}
    filteredSales.forEach((sale) => {
      if (!grouped[sale.productId]) {
        grouped[sale.productId] = {
          productName: sale.productName,
          quantity: 0,
          revenue: 0,
          orders: 0,
        }
      }
      grouped[sale.productId].quantity += sale.quantity
      grouped[sale.productId].revenue += sale.amount
      grouped[sale.productId].orders += 1
    })
    return Object.values(grouped).sort((a, b) => b.revenue - a.revenue)
  }, [filteredSales])

  const dailyBreakdown = useMemo(() => {
    const grouped = {}
    filteredSales.forEach((sale) => {
      if (!grouped[sale.date]) {
        grouped[sale.date] = { date: sale.date, revenue: 0, orders: 0 }
      }
      grouped[sale.date].revenue += sale.amount
      grouped[sale.date].orders += 1
    })
    return Object.values(grouped).sort((a, b) => new Date(b.date) - new Date(a.date))
  }, [filteredSales])

  const inputClasses =
    'w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm text-foreground placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all'

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Sales Reports</h2>
          <p className="text-sm text-muted mt-1">Track revenue and sales performance</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-dark transition-colors cursor-pointer">
          <FiDownload className="w-4 h-4" />
          Export Report
        </button>
      </div>

      {/* Period Tabs */}
      <div className="flex flex-wrap gap-2">
        {periods.map((p) => (
          <button
            key={p.key}
            onClick={() => setPeriod(p.key)}
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
        {[
          { label: 'Total Revenue', value: formatPrice(stats.totalRevenue), icon: <FiDollarSign />, color: 'success', change: 12.5 },
          { label: 'Total Orders', value: stats.totalOrders, icon: <FiShoppingBag />, color: 'primary', change: 8.3 },
          { label: 'Units Sold', value: stats.totalUnits, icon: <FiTrendingUp />, color: 'info', change: 15.2 },
          { label: 'Avg. Order Value', value: formatPrice(stats.avgOrder), icon: <FiCalendar />, color: 'warning', change: -2.1 },
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
              <div className={`flex items-center gap-1 text-xs font-medium ${stat.change >= 0 ? 'text-success' : 'text-danger'}`}>
                {stat.change >= 0 ? <FiArrowUp className="w-3 h-3" /> : <FiArrowDown className="w-3 h-3" />}
                {Math.abs(stat.change)}%
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
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
              onChange={(e) => setProductFilter(e.target.value)}
              className={`${inputClasses} max-w-[250px]`}
            >
              <option value="all">All Products</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          {/* Sales Table */}
          <div className="bg-surface border border-border rounded-2xl overflow-hidden">
            <div className="p-5 border-b border-border">
              <h3 className="text-lg font-bold text-foreground">Recent Sales</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-background">
                    {['Date', 'Product', 'Customer', 'Qty', 'Amount'].map((h) => (
                      <th key={h} className="text-left text-xs font-semibold text-muted uppercase tracking-wider px-6 py-3">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredSales.slice(0, 10).map((sale, index) => (
                    <motion.tr
                      key={sale.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className="hover:bg-background/50 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm text-muted whitespace-nowrap">
                        {formatDate(sale.date)}
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-foreground truncate max-w-[150px]">
                          {sale.productName}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted whitespace-nowrap">
                        {sale.customer}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-foreground">
                        {sale.quantity}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-foreground whitespace-nowrap">
                        {formatPrice(sale.amount)}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredSales.length === 0 && (
              <div className="p-12 text-center">
                <FiShoppingBag className="w-12 h-12 text-muted mx-auto mb-4" />
                <p className="text-muted">No sales found for this period</p>
              </div>
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
              {productWiseSales.slice(0, 5).map((product, index) => {
                const maxRevenue = productWiseSales[0]?.revenue || 1
                const percentage = (product.revenue / maxRevenue) * 100
                return (
                  <motion.div
                    key={product.productName}
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
                        {formatPrice(product.revenue)}
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
                    <p className="text-xs text-muted">{product.quantity} units • {product.orders} orders</p>
                  </motion.div>
                )
              })}
              {productWiseSales.length === 0 && (
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
              {dailyBreakdown.slice(0, 7).map((day, index) => (
                <motion.div
                  key={day.date}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between p-3 bg-background rounded-xl"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">{formatDate(day.date)}</p>
                    <p className="text-xs text-muted">{day.orders} orders</p>
                  </div>
                  <p className="text-sm font-bold text-success">{formatPrice(day.revenue)}</p>
                </motion.div>
              ))}
              {dailyBreakdown.length === 0 && (
                <p className="text-sm text-muted text-center py-4">No data available</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}