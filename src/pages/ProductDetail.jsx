import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiArrowLeft, FiStar, FiShoppingBag, FiShield, FiTruck, FiCheck } from 'react-icons/fi'
import Button from '../components/Button'
import ProductCard from '../components/ProductCard'
import ScrollReveal from '../components/ScrollReveal'
import { products, gradients, formatPrice } from '../data'

export default function ProductDetail() {
  const { id } = useParams()
  const product = products.find((p) => p.id === Number(id))

  if (!product) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">Product Not Found</h2>
          <Link to="/products">
            <Button variant="outline">Back to Products</Button>
          </Link>
        </div>
      </div>
    )
  }

  const gradient = gradients[product.id % gradients.length]
  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4)

  const discount = product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  return (
    <>
      {/* ─── Breadcrumb ─── */}
      <div className="bg-surface border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-sm text-muted hover:text-primary transition-colors font-medium"
          >
            <FiArrowLeft /> Back to Products
          </Link>
        </div>
      </div>

      {/* ─── Product Info ─── */}
      <section className="py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div
                className="aspect-square rounded-3xl flex items-center justify-center shadow-2xl shadow-primary/10"
                style={{ background: gradient }}
              >
                <FiShoppingBag className="text-white/25 text-[120px]" />
              </div>
            </motion.div>

            {/* Details */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <span className="text-sm font-semibold text-primary uppercase tracking-wider">
                {product.brand}
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground mt-2 mb-4">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <FiStar
                      key={i}
                      className={`text-sm ${i < Math.round(product.rating) ? 'text-warning fill-warning' : 'text-border'}`}
                    />
                  ))}
                </div>
                <span className="text-sm font-medium text-foreground">{product.rating}</span>
                <span className="text-sm text-muted">({product.reviews} reviews)</span>
              </div>

              {/* Price */}
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl font-extrabold text-foreground">{formatPrice(product.price)}</span>
                {discount > 0 && (
                  <>
                    <span className="text-lg text-muted line-through">{formatPrice(product.originalPrice)}</span>
                    <span className="bg-success/10 text-success text-sm font-bold px-2.5 py-1 rounded-lg">
                      {discount}% OFF
                    </span>
                  </>
                )}
              </div>

              {/* Stock */}
              <div className="mb-6">
                {product.stock > 10 ? (
                  <span className="inline-flex items-center gap-1.5 text-sm font-medium text-success">
                    <FiCheck /> In Stock
                  </span>
                ) : product.stock > 0 ? (
                  <span className="inline-flex items-center gap-1.5 text-sm font-medium text-warning">
                    <FiCheck /> Only {product.stock} left
                  </span>
                ) : (
                  <span className="text-sm font-medium text-danger">Out of Stock</span>
                )}
              </div>

              {/* Description */}
              <p className="text-muted leading-relaxed mb-8">{product.description}</p>

              {/* CTAs */}
              <div className="flex flex-wrap gap-4 mb-8">
                <Button size="lg" disabled={product.stock === 0}>
                  {product.stock === 0 ? 'Out of Stock' : 'Enquire Now'}
                </Button>
                <Link to="/contact">
                  <Button variant="outline" size="lg">
                    Contact for Price
                  </Button>
                </Link>
              </div>

              {/* Trust badges */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: <FiShield />, text: 'Genuine Warranty' },
                  { icon: <FiTruck />, text: 'Fast Delivery' },
                ].map((badge, i) => (
                  <div key={i} className="flex items-center gap-2.5 bg-background rounded-xl p-3 border border-border">
                    <span className="text-primary text-lg">{badge.icon}</span>
                    <span className="text-sm font-medium text-foreground">{badge.text}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── Specifications ─── */}
      <section className="py-12 lg:py-16 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <h2 className="text-2xl font-bold text-foreground mb-8">Specifications</h2>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <div className="bg-background rounded-2xl border border-border overflow-hidden">
              {Object.entries(product.specifications).map(([key, value], i) => (
                <div
                  key={key}
                  className={`flex items-center justify-between px-6 py-4 ${
                    i !== Object.entries(product.specifications).length - 1 ? 'border-b border-border' : ''
                  }`}
                >
                  <span className="text-sm font-medium text-muted">{key}</span>
                  <span className="text-sm font-semibold text-foreground">{value}</span>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ─── Related Products ─── */}
      {related.length > 0 && (
        <section className="py-12 lg:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal>
              <h2 className="text-2xl font-bold text-foreground mb-8">Related Products</h2>
            </ScrollReveal>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}