import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiFilter, FiRefreshCw } from 'react-icons/fi';
import ProductCard from '../components/ProductCard';
import ProductCardSkeleton from '../components/ProductCardSkeleton';
import ScrollReveal from '../components/ScrollReveal';
import AlertMessage from '../components/AlertMessage';
import productsApi from '../services/productsApi';

// Categories
const categories = ['All', 'Smartphones', 'Accessories', 'Tablets', 'Wearables'];

// Sort options
const sortOptions = [
  { value: '', label: 'Default' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'name_asc', label: 'Name: A to Z' },
  { value: 'rating', label: 'Top Rated' },
];

export default function Products() {
  // Data state
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filter states
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy] = useState('');

  // Pagination
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
  });

  // Debounce search
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  // Fetch products when filters change
  useEffect(() => {
    fetchProducts();
  }, [activeCategory, sortBy, debouncedSearch, pagination.page]);

  // Fetch products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError('');

      const params = {
        page: pagination.page,
        limit: 12,
      };

      if (activeCategory !== 'All') {
        params.category = activeCategory;
      }

      if (debouncedSearch) {
        params.search = debouncedSearch;
      }

      if (sortBy) {
        params.sort = sortBy;
      }

      const response = await productsApi.getProducts(params);

      if (response.success) {
        setProducts(response.data);
        setPagination({
          page: response.currentPage,
          totalPages: response.totalPages,
          total: response.total,
        });
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Reset filters
  const resetFilters = () => {
    setSearch('');
    setActiveCategory('All');
    setSortBy('');
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  // Handle category change
  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  // Handle sort change
  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  return (
    <>
      {/* Header */}
      <section className="bg-gradient-to-br from-primary/90 to-primary py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center"
          >
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">
              Our Products
            </h1>
            <p className="text-white/70 max-w-xl mx-auto">
              Browse our complete range of smartphones, tablets, accessories, and wearables.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-6 bg-surface border-b border-border sticky top-16 lg:top-20 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-4">
            {/* Search */}
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

            {/* Category Filters */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
              <FiFilter className="text-muted shrink-0" />
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
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

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={handleSortChange}
              className="px-4 py-3 bg-background border border-border rounded-xl text-sm text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            {/* Reset Button */}
            <button
              onClick={resetFilters}
              className="p-3 bg-background border border-border rounded-xl text-muted hover:text-foreground hover:bg-border/50 transition-all cursor-pointer"
              title="Reset filters"
            >
              <FiRefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Error Alert */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <AlertMessage
            type="error"
            message={error}
            onClose={() => setError('')}
          />
        </div>
      )}

      {/* Products Grid */}
      <section className="py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Results Count */}
          <div className="flex items-center justify-between mb-8">
            <p className="text-sm text-muted">
              {loading ? (
                'Loading products...'
              ) : (
                <>
                  Showing{' '}
                  <span className="font-semibold text-foreground">
                    {products.length}
                  </span>{' '}
                  of{' '}
                  <span className="font-semibold text-foreground">
                    {pagination.total}
                  </span>{' '}
                  products
                </>
              )}
            </p>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : products.length === 0 ? (
            /* Empty State */
            <ScrollReveal>
              <div className="text-center py-20">
                <FiSearch className="text-5xl text-border mx-auto mb-4" />
                <h3 className="text-xl font-bold text-foreground mb-2">
                  No products found
                </h3>
                <p className="text-muted mb-6">
                  Try adjusting your search or filter criteria.
                </p>
                <button
                  onClick={resetFilters}
                  className="px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors cursor-pointer"
                >
                  Reset Filters
                </button>
              </div>
            </ScrollReveal>
          ) : (
            /* Products Grid */
            <>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product, i) => (
                  <ProductCard key={product._id} product={product} index={i} />
                ))}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-12">
                  <button
                    onClick={() =>
                      setPagination((prev) => ({
                        ...prev,
                        page: Math.max(1, prev.page - 1),
                      }))
                    }
                    disabled={pagination.page === 1}
                    className="px-4 py-2 bg-background border border-border rounded-xl text-sm font-medium text-foreground hover:bg-border/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    Previous
                  </button>

                  {/* Page Numbers */}
                  <div className="flex items-center gap-1">
                    {[...Array(pagination.totalPages)].map((_, i) => {
                      const page = i + 1;
                      // Show first, last, current, and adjacent pages
                      if (
                        page === 1 ||
                        page === pagination.totalPages ||
                        (page >= pagination.page - 1 && page <= pagination.page + 1)
                      ) {
                        return (
                          <button
                            key={page}
                            onClick={() =>
                              setPagination((prev) => ({ ...prev, page }))
                            }
                            className={`w-10 h-10 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                              pagination.page === page
                                ? 'bg-primary text-white'
                                : 'bg-background border border-border text-foreground hover:bg-border/50'
                            }`}
                          >
                            {page}
                          </button>
                        );
                      } else if (
                        page === pagination.page - 2 ||
                        page === pagination.page + 2
                      ) {
                        return (
                          <span key={page} className="px-2 text-muted">
                            ...
                          </span>
                        );
                      }
                      return null;
                    })}
                  </div>

                  <button
                    onClick={() =>
                      setPagination((prev) => ({
                        ...prev,
                        page: Math.min(prev.totalPages, prev.page + 1),
                      }))
                    }
                    disabled={pagination.page === pagination.totalPages}
                    className="px-4 py-2 bg-background border border-border rounded-xl text-sm font-medium text-foreground hover:bg-border/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}