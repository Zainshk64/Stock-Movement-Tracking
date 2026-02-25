import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiUser, 
  FiSettings, 
  FiLogOut, 
  FiShield,
  FiChevronDown,
  FiPackage
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

export default function ProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { user, logout, isAdmin } = useAuth();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Get initials for avatar
  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Get avatar background color based on name
  const getAvatarColor = (name) => {
    const colors = [
      'bg-blue-500',
      'bg-green-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-teal-500',
    ];
    const index = name ? name.charCodeAt(0) % colors.length : 0;
    return colors[index];
  };

  const menuItems = [
    // {
    //   icon: FiUser,
    //   label: 'My Profile',
    //   to: '/profile',
    // },
    // {
    //   icon: FiPackage,
    //   label: 'My Orders',
    //   to: '/orders',
    // },
    ...(isAdmin
      ? [
          {
            icon: FiShield,
            label: 'Admin Panel',
            to: '/admin',
          },
        ]
      : []),
    // {
    //   icon: FiSettings,
    //   label: 'Settings',
    //   to: '/settings',
    // },
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Avatar Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1 rounded-xl hover:bg-background transition-colors cursor-pointer"
      >
        <div
          className={`w-9 h-9 ${getAvatarColor(user?.name)} rounded-xl flex items-center justify-center`}
        >
          <span className="text-white text-sm font-semibold">
            {getInitials(user?.name)}
          </span>
        </div>
        <div className="hidden sm:block text-left">
          <p className="text-sm font-medium text-foreground truncate max-w-[100px]">
            {user?.name}
          </p>
          <p className="text-xs text-muted capitalize">{user?.role}</p>
        </div>
        <FiChevronDown
          className={`text-muted transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-64 bg-surface border border-border rounded-2xl shadow-xl shadow-secondary/10 overflow-hidden z-50"
          >
            {/* User Info Header */}
            <div className="p-4 border-b border-border bg-background/50">
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 ${getAvatarColor(user?.name)} rounded-xl flex items-center justify-center`}
                >
                  <span className="text-white text-lg font-semibold">
                    {getInitials(user?.name)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">
                    {user?.name}
                  </p>
                  <p className="text-xs text-muted truncate">{user?.email}</p>
                  {isAdmin && (
                    <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 bg-primary/10 text-primary text-xs font-medium rounded-full">
                      <FiShield className="text-[10px]" />
                      Admin
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="p-2">
              {menuItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.to}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-foreground hover:bg-background transition-colors"
                >
                  <item.icon className="text-muted" />
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Logout */}
            <div className="p-2 border-t border-border">
              <button
                onClick={() => {
                  setIsOpen(false);
                  logout();
                }}
                className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors cursor-pointer"
              >
                <FiLogOut />
                Sign Out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}