import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiStar, FiShoppingBag } from 'react-icons/fi';

// Format price helper
const formatPrice = (price) => {
  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    minimumFractionDigits: 0,
  }).format(price);
};

// Gradient backgrounds for cards
const gradients = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
];

export default function ProductCard({ product, index = 0 }) {
  const gradient = gradients[index % gradients.length];
  
  const discount =
    product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      whileHover={{ y: -5 }}
      className="group bg-surface border border-border rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-primary/10 transition-all duration-300"
    >
      <Link to={`/products/${product._id}`}>
        {/* Image */}
        <div
          className="aspect-square relative overflow-hidden"
          style={{ background: product.image ? '#f5f5f5' : gradient }}
        >
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentElement.style.background = gradient;
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <FiShoppingBag className="text-white/30 text-6xl" />
            </div>
          )}

          {/* Discount Badge */}
          {discount > 0 && (
            <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-lg">
              {discount}% OFF
            </div>
          )}

          {/* Featured Badge */}
          {product.featured && (
            <div className="absolute top-3 right-3 bg-yellow-500 text-white text-xs font-bold px-2.5 py-1 rounded-lg">
              Featured
            </div>
          )}

          {/* Out of Stock Overlay */}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="bg-white text-black text-sm font-bold px-4 py-2 rounded-lg">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Brand */}
          <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">
            {product.brand}
          </p>

          {/* Title */}
          <h3 className="text-base font-bold text-foreground mb-2 line-clamp-2 min-h-[2.5rem] group-hover:text-primary transition-colors">
            {product.name}
          </h3>

          {/* Rating */}
          {/* <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <FiStar
                  key={i}
                  className={`text-xs ${
                    i < Math.round(product.rating)
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-muted">
              ({product.reviews || 0})
            </span>
          </div> */}

          {/* Price */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg font-extrabold text-foreground">
              {formatPrice(product.price)}
            </span>
            {discount > 0 && (
              <span className="text-sm text-muted line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          {/* Stock Status */}
          <div className="mb-4">
            {product.stock > 10 ? (
              <span className="text-xs font-medium text-green-600">In Stock</span>
            ) : product.stock > 0 ? (
              <span className="text-xs font-medium text-yellow-600">
                Only {product.stock} left
              </span>
            ) : (
              <span className="text-xs font-medium text-red-500">Out of Stock</span>
            )}
          </div>

          {/* View Button */}
          <div className="w-full py-2.5 bg-primary/10 text-primary rounded-xl text-sm font-semibold text-center group-hover:bg-primary group-hover:text-white transition-all">
            View Details
          </div>
        </div>
      </Link>
    </motion.div>
  );
}