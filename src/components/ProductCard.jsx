import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiShoppingBag, FiStar } from 'react-icons/fi'
import { gradients, formatPrice } from '../data'

export default function ProductCard({ product, index = 0 }) {
  const gradient = gradients[product.id % gradients.length]
  const discount = product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      
      <Link  to={`/products/${product.id}`} className="block group">
        <div className="bg-surface rounded-2xl overflow-hidden border border-border hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">
          {/* Image placeholder */}
          <div
            className="relative h-56  flex items-center justify-center overflow-hidden"
            // style={{ backgroundImage: product.image }}
          >
            <img src={product.image} alt="" className="w-full aspect-square object-cover" />
            <FiShoppingBag className="text-white/30 text-7xl group-hover:scale-110 transition-transform duration-500" />
            {discount > 0 && (
              <span className="absolute top-3 left-3 bg-danger text-white text-xs font-bold px-2.5 py-1 rounded-lg">
                -{discount}%
              </span>
            )}
            {product.stock <= 5 && product.stock > 0 && (
              <span className="absolute top-3 right-3 bg-warning text-white text-xs font-bold px-2.5 py-1 rounded-lg">
                Only {product.stock} left
              </span>
            )}
            {product.stock === 0 && (
              <span className="absolute top-3 right-3 bg-danger text-white text-xs font-bold px-2.5 py-1 rounded-lg">
                Out of Stock
              </span>
            )}
          </div>

          {/* Details */}
          <div className="p-5">
            <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">
              {product.brand}
            </p>
            <h3 className="text-foreground font-bold text-lg leading-tight mb-2 group-hover:text-primary transition-colors">
              {product.name}
            </h3>
            <div className="flex items-center gap-1 mb-3">
              <FiStar className="text-warning fill-warning text-sm" />
              <span className="text-sm font-medium text-foreground">{product.rating}</span>
              <span className="text-xs text-muted">({product.reviews})</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-foreground">
                {formatPrice(product.price)}
              </span>
              {discount > 0 && (
                <span className="text-sm text-muted line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}