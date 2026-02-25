import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Lenis from "lenis";

import MainLayout from "./layouts/MainLayout";
import AdminLayout from "./layouts/AdminLayout";

import Home from "./pages/Home";
import About from "./pages/About";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Contact from "./pages/Contact";

import Dashboard from "./pages/admin/Dashboard";
import AdminProducts from "./pages/admin/AdminProducts";
// import StockManagement from './pages/admin/StockManagement'
// import SalesReports from './pages/admin/SalesReports'

import ScrollToTop from "./components/ScrollToTop";
import NotFound from "./pages/NotFound";
import StockManagement from "./pages/admin/StockManagement";
import SalesReports from "./pages/admin/SalesReports";
import { AuthProvider } from "./context/AuthContext";
import AuthRoot from "./pages/auth/AuthRoot";

export default function App() {
  // useEffect(() => {
  //   const lenis = new Lenis({
  //     duration: 1.2,
  //     easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  //     smoothWheel: true,
  //   })
  //   function raf(time) {
  //     lenis.raf(time)
  //     requestAnimationFrame(raf)
  //   }
  //   requestAnimationFrame(raf)
  //   return () => lenis.destroy()
  // }, [])

  return (
    <>
      <ScrollToTop />
      <AuthProvider>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/auth" element={<AuthRoot />} />
            <Route path="/*" element={<NotFound />} />
          </Route>
          <Route path="/admin" element={<AdminLayout />}>
            {/* <Route index element={<Dashboard />} /> */}
            <Route index element={<AdminProducts />} />
            <Route path="stock" element={<StockManagement />} />
            <Route path="sales" element={<SalesReports />} />
          </Route>
        </Routes>
      </AuthProvider>
    </>
  );
}
