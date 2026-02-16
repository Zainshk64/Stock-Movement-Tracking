import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiPackage, FiX, FiAlertTriangle } from 'react-icons/fi'
import Button from '../../components/Button'
import { products as initialProducts, categories, formatPrice } from '../../data'

const emptyProduct = {
  name: '', brand: '', category: 'Smartphones', price: '', originalPrice: '', stock: '', description: '',
}

export default function AdminProducts() {
  const [productList, setProductList] = useState(initialProducts)
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [form, setForm] = useState(emptyProduct)
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  const filtered = productList.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.brand.toLowerCase().includes(search.toLowerCase())
  )

  const openAdd = () => {
    setEditingProduct(null)
    setForm(emptyProduct)
    setModalOpen(true)
  }

  const openEdit = (product) => {
    setEditingProduct(product)
    setForm({
      name: product.name,
      brand: product.brand,
      category: product.category,
      price: product.price,
      originalPrice: product.originalPrice,
      stock: product.stock,
      description: product.description,
    })
    setModalOpen(true)
  }

  const handleSave = (e) => {
    e.preventDefault()
    if (editingProduct) {
      setProductList((prev) =>
        prev.map((p) =>
          p.id === editingProduct.id
            ? { ...p, ...form, price: Number(form.price), originalPrice: Number(form.originalPrice), stock: Number(form.stock) }
            : p
        )
      )
    } else {
      const newProduct = {
        ...form,
        id: Date.now(),
        price: Number(form.price),
        originalPrice: Number(form.originalPrice),
        stock: Number(form.stock),
        rating: 0,
        reviews: 0,
        featured: false,
        specifications: {},
        image: 'https://via.placeholder.com/300x300?text=Product',
      }
      setProductList((prev) => [newProduct, ...prev])
    }
    setModalOpen(false)
  }

  const handleDelete = (id) => {
    setProductList((prev) => prev.filter((p) => p.id !== id))
    setDeleteConfirm(null)
  }

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const inputClasses =
    'w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm text-foreground placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all'

  const getStockStatus = (stock) => {
    if (stock === 0) return { label: 'Out of Stock', color: 'bg-danger/10 text-danger' }
    if (stock <= 5) return { label: 'Low Stock', color: 'bg-warning/10 text-warning' }
    return { label: 'In Stock', color: 'bg-success/10 text-success' }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Products</h2>
          <p className="text-sm text-muted mt-1">{productList.length} total products</p>
        </div>
        <Button icon={<FiPlus />} onClick={openAdd}>Add Product</Button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`${inputClasses} pl-11`}
        />
      </div>

      {/* Table */}
      <div className="bg-surface border border-border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-background">
                {['Product', 'Category', 'Price', 'Stock', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="text-left text-xs font-semibold text-muted uppercase tracking-wider px-6 py-4">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((product, index) => {
                const status = getStockStatus(product.stock)
                return (
                  <motion.tr
                    key={product.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-background/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-background border border-border overflow-hidden shrink-0">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-foreground truncate max-w-[200px]">{product.name}</p>
                          <p className="text-xs text-muted">{product.brand}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-foreground">{formatPrice(product.price)}</p>
                      {product.originalPrice > product.price && (
                        <p className="text-xs text-muted line-through">{formatPrice(product.originalPrice)}</p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-foreground">{product.stock}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${status.color}`}>
                        {status.label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEdit(product)}
                          className="p-2 rounded-lg hover:bg-primary/10 text-primary transition-colors cursor-pointer"
                        >
                          <FiEdit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(product)}
                          className="p-2 rounded-lg hover:bg-danger/10 text-danger transition-colors cursor-pointer"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
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
            <p className="text-muted">No products found</p>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
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
              className="bg-surface border border-border rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-border flex items-center justify-between">
                <h3 className="text-lg font-bold text-foreground">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
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
                  <label className="block text-sm font-medium text-foreground mb-1.5">Product Name</label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className={inputClasses}
                    placeholder="iPhone 15 Pro Max"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Brand</label>
                    <input
                      type="text"
                      name="brand"
                      value={form.brand}
                      onChange={handleChange}
                      required
                      className={inputClasses}
                      placeholder="Apple"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Category</label>
                    <select
                      name="category"
                      value={form.category}
                      onChange={handleChange}
                      className={inputClasses}
                    >
                      {categories.filter(c => c !== 'All').map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Price</label>
                    <input
                      type="number"
                      name="price"
                      value={form.price}
                      onChange={handleChange}
                      required
                      className={inputClasses}
                      placeholder="159900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Original Price</label>
                    <input
                      type="number"
                      name="originalPrice"
                      value={form.originalPrice}
                      onChange={handleChange}
                      className={inputClasses}
                      placeholder="169900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Stock</label>
                    <input
                      type="number"
                      name="stock"
                      value={form.stock}
                      onChange={handleChange}
                      required
                      className={inputClasses}
                      placeholder="10"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Description</label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows={3}
                    className={inputClasses}
                    placeholder="Product description..."
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
                    className="flex-1 px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-dark transition-colors cursor-pointer"
                  >
                    {editingProduct ? 'Update' : 'Add'} Product
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-secondary/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setDeleteConfirm(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-surface border border-border rounded-2xl w-full max-w-sm p-6"
            >
              <div className="w-12 h-12 bg-danger/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <FiAlertTriangle className="w-6 h-6 text-danger" />
              </div>
              <h3 className="text-lg font-bold text-foreground text-center mb-2">Delete Product</h3>
              <p className="text-sm text-muted text-center mb-6">
                Are you sure you want to delete "{deleteConfirm.name}"? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 px-4 py-2.5 bg-background border border-border rounded-xl text-sm font-medium text-foreground hover:bg-border/50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm.id)}
                  className="flex-1 px-4 py-2.5 bg-danger text-white rounded-xl text-sm font-medium hover:bg-danger/90 transition-colors cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}