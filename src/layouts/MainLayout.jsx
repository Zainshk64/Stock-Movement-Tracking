import { useState, useEffect } from 'react'
import { Outlet, Link, NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiMenu, FiX, FiSmartphone, FiMail, FiPhone,
  FiMapPin, FiChevronRight, FiInstagram, FiTwitter, FiFacebook,
} from 'react-icons/fi'

/* ─── Navbar ─── */
function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setMobileOpen(false)
  }, [location])

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const links = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About' },
    { to: '/products', label: 'Products' },
    { to: '/contact', label: 'Contact' },
  ]

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-surface/95 backdrop-blur-md shadow-lg shadow-secondary/5'
          : 'bg-surface/80 backdrop-blur-sm'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center group-hover:bg-primary-dark transition-colors">
              <FiSmartphone className="text-white text-xl" />
            </div>
            <div>
              <span className="text-lg font-bold text-foreground tracking-tight">Mohsin</span>
              <span className="text-lg font-bold text-primary tracking-tight"> Mobiles</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-primary text-white'
                      : 'text-muted hover:text-foreground hover:bg-background'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Desktop Auth */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              to="/admin"
              className="text-xs text-muted hover:text-primary font-medium transition-colors"
            >
              Admin
            </Link>
            <Link
              to="/auth"
              className="px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20"
            >
              Sign In
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 rounded-xl hover:bg-background text-foreground transition-colors cursor-pointer"
          >
            {mobileOpen ? <FiX className="text-2xl" /> : <FiMenu className="text-2xl" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden border-t border-border bg-surface overflow-hidden"
          >
            <div className="px-4 py-4 space-y-1">
              {links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === '/'}
                  className={({ isActive }) =>
                    `block px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-primary text-white'
                        : 'text-foreground hover:bg-background'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
              <hr className="border-border my-2" />
              <Link
                to="/admin"
                className="block px-4 py-3 rounded-xl text-sm font-medium text-muted hover:bg-background transition-all"
              >
                Admin Panel
              </Link>
              <Link
                to="/auth"
                className="block px-4 py-3 rounded-xl text-sm font-semibold bg-primary text-white text-center mt-2"
              >
                Sign In
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

/* ─── Footer ─── */
function Footer() {
  const quickLinks = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About Us' },
    { to: '/products', label: 'Products' },
    { to: '/contact', label: 'Contact' },
    { to: '/auth', label: 'Sign In' },
  ]
  const productLinks = [
    { to: '/products', label: 'Smartphones' },
    { to: '/products', label: 'Tablets' },
    { to: '/products', label: 'Accessories' },
    { to: '/products', label: 'Wearables' },
  ]

  return (
    <footer className="bg-secondary text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2.5 mb-5">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <FiSmartphone className="text-white text-xl" />
              </div>
              <span className="text-xl font-bold tracking-tight">Mohsin Mobiles</span>
            </Link>
            <p className="text-white/60 text-sm leading-relaxed mb-5">
              Your trusted destination for the latest smartphones, tablets, and accessories.
              Quality products at the best prices.
            </p>
            <div className="flex gap-3">
              {[FiFacebook, FiInstagram, FiTwitter].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center hover:bg-primary transition-colors"
                >
                  <Icon className="text-lg" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white/40 mb-5">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-white/60 hover:text-white text-sm flex items-center gap-2 transition-colors"
                  >
                    <FiChevronRight className="text-xs" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white/40 mb-5">Products</h4>
            <ul className="space-y-3">
              {productLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-white/60 hover:text-white text-sm flex items-center gap-2 transition-colors"
                  >
                    <FiChevronRight className="text-xs" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white/40 mb-5">Get In Touch</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm text-white/60">
                <FiMapPin className="text-primary mt-0.5 shrink-0" />
                <span>123 Mobile Street, Tech City, pakistan 400001</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-white/60">
                <FiPhone className="text-primary shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-white/60">
                <FiMail className="text-primary shrink-0" />
                <span>hello@Mohsinmobiles.com</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} Mohsin Mobiles. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-white/40">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

/* ─── Layout ─── */
export default function MainLayout() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-16 lg:pt-20">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <Outlet />
        </motion.div>
      </main>
      <Footer />
    </>
  )
}