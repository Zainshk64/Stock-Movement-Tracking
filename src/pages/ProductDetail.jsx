import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiArrowLeft,
  FiStar,
  FiShoppingBag,
  FiShield,
  FiTruck,
  FiCheck,
  FiAlertCircle,
} from 'react-icons/fi';
import Button from '../components/Button';
import ProductCard from '../components/ProductCard';
import ProductDetailSkeleton from '../components/ProductDetailSkeleton';
import ProductCardSkeleton from '../components/ProductCardSkeleton';
import ScrollReveal from '../components/ScrollReveal';
import AlertMessage from '../components/AlertMessage';
import productsApi from '../services/productsApi';

// Gradient backgrounds
const gradients = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
];

// Format price helper
const formatPrice = (price) => {
  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    minimumFractionDigits: 0,
  }).format(price);
};

export default function ProductDetail() {
  const { id } = useParams();

  // States
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [relatedLoading, setRelatedLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch product on mount and when ID changes
  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  // Fetch related products when product category is available
  useEffect(() => {
    if (product?.category) {
      fetchRelatedProducts();
    }
  }, [product?.category]);

  // Scroll to top when product changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  // Fetch single product
  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await productsApi.getProduct(id);

      if (response.success) {
        setProduct(response.data);
      } else {
        setError('Product not found');
      }
    } catch (err) {
      setError(err.message || 'Failed to load product');
      setProduct(null);
    } finally {
      setLoading(false);
    }
  };

  // Fetch related products
  const fetchRelatedProducts = async () => {
    try {
      setRelatedLoading(true);

      const response = await productsApi.getProducts({
        category: product.category,
        limit: 5,
      });

      if (response.success) {
        // Filter out current product
        const filtered = response.data.filter((p) => p._id !== id);
        setRelatedProducts(filtered.slice(0, 4));
      }
    } catch (err) {
      console.error('Failed to fetch related products:', err);
    } finally {
      setRelatedLoading(false);
    }
  };

  // Calculate discount
  const discount =
    product?.originalPrice > product?.price
      ? Math.round(
          ((product.originalPrice - product.price) / product.originalPrice) * 100
        )
      : 0;

  // Get gradient for product
  const gradient = gradients[id?.charCodeAt(0) % gradients.length] || gradients[0];

  // Loading state
  if (loading) {
    return (
      <>
        {/* Breadcrumb */}
        <div className="bg-surface border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="h-5 w-32 bg-background rounded animate-pulse" />
          </div>
        </div>
        <ProductDetailSkeleton />
      </>
    );
  }

  // Error state
  if (error || !product) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <FiAlertCircle className="text-5xl text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">
            {error || 'Product Not Found'}
          </h2>
          <p className="text-muted mb-6">
            The product you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/products">
            <Button variant="outline">Back to Products</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Breadcrumb */}
      <div className="bg-surface border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-sm">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 text-muted hover:text-primary transition-colors font-medium"
            >
              <FiArrowLeft /> Back to Products
            </Link>
            <span className="text-muted">/</span>
            <span className="text-foreground font-medium truncate max-w-[200px]">
              {product.name}
            </span>
          </div>
        </div>
      </div>

      {/* Product Info */}
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
                className="aspect-square rounded-3xl flex items-center justify-center shadow-2xl shadow-primary/10 overflow-hidden"
                style={{ background: product.image ? '#f5f5f5' : gradient }}
              >
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement.style.background = gradient;
                      e.target.parentElement.innerHTML = `<div class="flex items-center justify-center w-full h-full"><svg class="w-24 h-24 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg></div>`;
                    }}
                  />
                ) : (
                  <FiShoppingBag className="text-white/25 text-[120px]" />
                )}
              </div>

              {/* Badges */}
              <div className="flex gap-2 mt-4">
                {product.featured && (
                  <span className="bg-yellow-100 text-yellow-700 text-sm font-medium px-3 py-1 rounded-lg">
                    Featured
                  </span>
                )}
                {discount > 0 && (
                  <span className="bg-red-100 text-red-600 text-sm font-medium px-3 py-1 rounded-lg">
                    {discount}% OFF
                  </span>
                )}
                <span className="bg-blue-100 text-blue-600 text-sm font-medium px-3 py-1 rounded-lg">
                  {product.category}
                </span>
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
              {/* <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <FiStar
                      key={i}
                      className={`text-sm ${
                        i < Math.round(product.rating)
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm font-medium text-foreground">
                  {product.rating || 0}
                </span>
                <span className="text-sm text-muted">
                  ({product.reviews || 0} reviews)
                </span>
              </div> */}

              {/* Price */}
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl font-extrabold text-foreground">
                  {formatPrice(product.price)}
                </span>
                {discount > 0 && (
                  <>
                    <span className="text-lg text-muted line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                    <span className="bg-green-100 text-green-600 text-sm font-bold px-2.5 py-1 rounded-lg">
                      Save {formatPrice(product.originalPrice - product.price)}
                    </span>
                  </>
                )}
              </div>

              {/* Stock */}
              <div className="mb-6">
                {product.stock > 10 ? (
                  <span className="inline-flex items-center gap-1.5 text-sm font-medium text-green-600">
                    <FiCheck /> In Stock ({product.stock} available)
                  </span>
                ) : product.stock > 0 ? (
                  <span className="inline-flex items-center gap-1.5 text-sm font-medium text-yellow-600">
                    <FiCheck /> Only {product.stock} left in stock
                  </span>
                ) : (
                  <span className="text-sm font-medium text-red-500">
                    Out of Stock
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-muted leading-relaxed mb-8">
                {product.description || 'No description available for this product.'}
              </p>

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
                  <div
                    key={i}
                    className="flex items-center gap-2.5 bg-background rounded-xl p-3 border border-border"
                  >
                    <span className="text-primary text-lg">{badge.icon}</span>
                    <span className="text-sm font-medium text-foreground">
                      {badge.text}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Specifications */}
      {product.specifications && Object.keys(product.specifications).length > 0 && (
        <section className="py-12 lg:py-16 bg-surface">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal>
              <h2 className="text-2xl font-bold text-foreground mb-8">
                Specifications
              </h2>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <div className="bg-background rounded-2xl border border-border overflow-hidden">
                {Object.entries(product.specifications).map(([key, value], i, arr) => (
                  <div
                    key={key}
                    className={`flex items-center justify-between px-6 py-4 ${
                      i !== arr.length - 1 ? 'border-b border-border' : ''
                    }`}
                  >
                    <span className="text-sm font-medium text-muted">{key}</span>
                    <span className="text-sm font-semibold text-foreground">
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </section>
      )}

      {/* Related Products */}
      <section className="py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <h2 className="text-2xl font-bold text-foreground mb-8">
              Related Products
            </h2>
          </ScrollReveal>

          {relatedLoading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : relatedProducts.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p, i) => (
                <ProductCard key={p._id} product={p} index={i} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-surface rounded-2xl border border-border">
              <FiShoppingBag className="text-4xl text-muted mx-auto mb-4" />
              <p className="text-muted">No related products found</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}