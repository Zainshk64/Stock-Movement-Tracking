import { FiBox, FiDollarSign, FiTrendingUp, FiAlertTriangle, FiShoppingBag } from 'react-icons/fi'
import StatsCard from '../../components/StatsCard'
import ScrollReveal from '../../components/ScrollReveal'
import { products, salesData, stockLogs, formatPrice, formatDate } from '../../data'

export default function Dashboard() {
  const totalProducts = products.length
  const totalRevenue = salesData.reduce((sum, s) => sum + s.amount, 0)
  const totalSold = salesData.reduce((sum, s) => sum + s.quantity, 0)
  const lowStock = products.filter((p) => p.stock <= 5).length
  const unsettled = stockLogs.filter((l) => l.type === 'transferred' && !l.settled)
  const unsettledAmount = unsettled.reduce((sum, l) => sum + l.amount, 0)

  const recentSales = [...salesData].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 8)

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatsCard
          icon={<FiBox />}
          label="Total Products"
          value={totalProducts}
          change={12}
          color="primary"
          index={0}
        />
        <StatsCard
          icon={<FiDollarSign />}
          label="Total Revenue"
          value={formatPrice(totalRevenue)}
          change={8.5}
          color="success"
          index={1}
        />
        <StatsCard
          icon={<FiShoppingBag />}
          label="Units Sold"
          value={totalSold}
          change={15}
          color="info"
          index={2}
        />
        <StatsCard
          icon={<FiAlertTriangle />}
          label="Low Stock Items"
          value={lowStock}
          color="warning"
          index={3}
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Sales */}
        <ScrollReveal className="lg:col-span-2">
          <div className="bg-surface border border-border rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-border">
              <h3 className="text-lg font-bold text-foreground">Recent Sales</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-background">
                    <th className="text-left text-xs font-semibold text-muted uppercase tracking-wider px-6 py-3">Product</th>
                    <th className="text-left text-xs font-semibold text-muted uppercase tracking-wider px-6 py-3">Customer</th>
                    <th className="text-left text-xs font-semibold text-muted uppercase tracking-wider px-6 py-3">Qty</th>
                    <th className="text-left text-xs font-semibold text-muted uppercase tracking-wider px-6 py-3">Amount</th>
                    <th className="text-left text-xs font-semibold text-muted uppercase tracking-wider px-6 py-3">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {recentSales.map((sale) => (
                    <tr key={sale.id} className="hover:bg-background/50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-foreground whitespace-nowrap">{sale.productName}</td>
                      <td className="px-6 py-4 text-sm text-muted whitespace-nowrap">{sale.customer}</td>
                      <td className="px-6 py-4 text-sm text-foreground">{sale.quantity}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-foreground whitespace-nowrap">{formatPrice(sale.amount)}</td>
                      <td className="px-6 py-4 text-sm text-muted whitespace-nowrap">{formatDate(sale.date)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </ScrollReveal>

        {/* Unsettled Transfers */}
        <ScrollReveal direction="right">
          <div className="bg-surface border border-border rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-border">
              <h3 className="text-lg font-bold text-foreground">Unsettled Amounts</h3>
              <p className="text-2xl font-extrabold text-danger mt-1">{formatPrice(unsettledAmount)}</p>
            </div>
            <div className="p-4 space-y-3">
              {unsettled.length === 0 ? (
                <p className="text-sm text-muted text-center py-4">All settlements up to date</p>
              ) : (
                unsettled.map((log) => (
                  <div key={log.id} className="bg-background rounded-xl p-4 border border-border">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-semibold text-foreground">{log.person}</span>
                      <span className="text-sm font-bold text-danger">{formatPrice(log.amount)}</span>
                    </div>
                    <p className="text-xs text-muted">{log.productName} × {log.quantity}</p>
                    <p className="text-xs text-muted mt-1">{formatDate(log.date)}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </ScrollReveal>
      </div>

      {/* Low Stock Alerts */}
      <ScrollReveal>
        <div className="bg-surface border border-border rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-border">
            <h3 className="text-lg font-bold text-foreground">Low Stock Alerts</h3>
          </div>
          <div className="p-6">
            {products.filter(p => p.stock <= 5).length === 0 ? (
              <p className="text-sm text-muted text-center py-4">All products are well-stocked</p>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.filter(p => p.stock <= 5).map((p) => (
                  <div key={p.id} className="flex items-center gap-4 bg-background rounded-xl p-4 border border-border">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      p.stock === 0 ? 'bg-danger/10' : 'bg-warning/10'
                    }`}>
                      <FiAlertTriangle className={`${p.stock === 0 ? 'text-danger' : 'text-warning'}`} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">{p.name}</p>
                      <p className={`text-xs font-bold ${p.stock === 0 ? 'text-danger' : 'text-warning'}`}>
                        {p.stock === 0 ? 'Out of Stock' : `${p.stock} remaining`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </ScrollReveal>
    </div>
  )
}