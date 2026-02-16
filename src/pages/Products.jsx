import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { FiSearch, FiFilter } from 'react-icons/fi'
import ProductCard from '../components/ProductCard'
import ScrollReveal from '../components/ScrollReveal'
import { products, categories } from '../data'

export default function Products() {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.brand.toLowerCase().includes(search.toLowerCase())
      const matchCategory = activeCategory === 'All' || p.category === activeCategory
      return matchSearch && matchCategory
    })
  }, [search, activeCategory])

  return (
    <>
      {/* ─── Header ─── */}
      <section className="bg-gradient-to-br from-primary-dark to-primary py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center"
          >
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">Our Products</h1>
            <p className="text-white/70 max-w-xl mx-auto">
              Browse our complete range of smartphones, tablets, accessories, and wearables.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ─── Filters ─── */}
      <section className="py-8 bg-surface border-b border-border sticky top-16 lg:top-20 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-muted text-lg" />
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-background border border-border rounded-xl text-sm text-foreground placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
              <FiFilter className="text-muted shrink-0" />
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all cursor-pointer ${
                    activeCategory === cat
                      ? 'bg-primary text-white'
                      : 'bg-background text-muted hover:text-foreground border border-border'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Products Grid ─── */}
      <section className="py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-sm text-muted mb-8">
            Showing <span className="font-semibold text-foreground">{filtered.length}</span> products
          </p>

          {filtered.length === 0 ? (
            <ScrollReveal>
              <div className="text-center py-20">
                <FiSearch className="text-5xl text-border mx-auto mb-4" />
                <h3 className="text-xl font-bold text-foreground mb-2">No products found</h3>
                <p className="text-muted">Try adjusting your search or filter criteria.</p>
              </div>
            </ScrollReveal>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filtered.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}