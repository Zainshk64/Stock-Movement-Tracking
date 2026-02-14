// import { useState } from 'react'
// import { motion } from 'framer-motion'
// import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiPackage } from 'react-icons/fi'
// import Button from '../../components/Button'
// import Modal from '../../components/Modal'
// import { products as initialProducts, categories, formatPrice, gradients } from '../../data'

// const emptyProduct = {
//   name: '', brand: '', category: 'Smartphones', price: '', originalPrice: '', stock: '', description: '',
// }

// export default function AdminProducts() {
//   const [productList, setProductList] = useState(initialProducts)
//   const [search, setSearch] = useState('')
//   const [modalOpen, setModalOpen] = useState(false)
//   const [editingProduct, setEditingProduct] = useState(null)
//   const [form, setForm] = useState(emptyProduct)
//   const [deleteConfirm, setDeleteConfirm] = useState(null)

//   const filtered = productList.filter((p) =>
//     p.name.toLowerCase().includes(search.toLowerCase()) ||
//     p.brand.toLowerCase().includes(search.toLowerCase())
//   )

//   const openAdd = () => {
//     setEditingProduct(null)
//     setForm(emptyProduct)
//     setModalOpen(true)
//   }

//   const openEdit = (product) => {
//     setEditingProduct(product)
//     setForm({
//       name: product.name,
//       brand: product.brand,
//       category: product.category,
//       price: product.price,
//       originalPrice: product.originalPrice,
//       stock: product.stock,
//       description: product.description,
//     })
//     setModalOpen(true)
//   }

//   const handleSave = (e) => {
//     e.preventDefault()
//     if (editingProduct) {
//       setProductList((prev) =>
//         prev.map((p) =>
//           p.id === editingProduct.id
//             ? { ...p, ...form, price: Number(form.price), originalPrice: Number(form.originalPrice), stock: Number(form.stock) }
//             : p
//         )
//       )
//     } else {
//       const newProduct = {
//         ...form,
//         id: Date.now(),
//         price: Number(form.price),
//         originalPrice: Number(form.originalPrice),
//         stock: Number(form.stock),
//         rating: 0,
//         reviews: 0,
//         featured: false,
//         specifications: {},
//       }
//       setProductList((prev) => [newProduct, ...prev])
//     }
//     setModalOpen(false)
//   }

//   const handleDelete = (id) => {
//     setProductList((prev) => prev.filter((p) => p.id !== id))
//     setDeleteConfirm(null)
//   }

//   const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

//   const inputClasses =
//     'w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm text-foreground placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all'

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
//         <div>
//           <h2 className="text-2xl font-bold text-foreground">Products</h2>
//           <p className="text-sm text-muted mt-1">{productList.length} total products</p>
//         </div>
//         <Button icon={<FiPlus />} onClick={openAdd}>Add Product</Button>
//       </div>

//       {/* Search */}
//       <div className="relative max-w-sm">
//         <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
//         <input
//           type="text"
//           placeholder="Search products..."
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           className={`${inputClasses} pl-11`}
//         />
//       </div>

//       {/* Table */}
//       <div className="bg-surface border border-border rounded-2xl overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead>
//               <tr className="bg-background">
//                 {['Product', 'Category', 'Price', 'Stock', 'Status', 'Actions'].map((h) => (
//                   <th key={h} className="text-left text-xs font-semibold text-muted uppercase tracking-wider px-6 py-3">
//                     {h}

import React from "react";

const AdminProducts = () => {
  return <div>Admin products</div>;
};

export default AdminProducts;
