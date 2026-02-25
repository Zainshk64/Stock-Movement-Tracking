/* ─── Footer ─── */
import { Link } from 'react-router-dom'
import {
  FiMenu, FiX, FiSmartphone, FiMail, FiPhone,
  FiMapPin, FiChevronRight, FiInstagram, FiTwitter, FiFacebook,
} from 'react-icons/fi'


const Footer = () => {
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
export default Footer;