import { motion, AnimatePresence } from 'framer-motion';
import { FiCheckCircle, FiXCircle, FiX, FiAlertCircle, FiInfo } from 'react-icons/fi';

const alertStyles = {
  success: {
    bg: 'bg-green-50 dark:bg-green-900/20',
    border: 'border-green-200 ',
    text: 'text-green-800 ',
    icon: FiCheckCircle,
    iconColor: 'text-green-500',
  },
  error: {
    bg: 'bg-red-100',
    border: 'border-red-200 ',
    text: 'text-red-800 ',
    icon: FiXCircle,
    iconColor: 'text-red-500',
  },
  warning: {
    bg: 'bg-yellow-50 dark:bg-yellow-900/20',
    border: 'border-yellow-200 dark:border-yellow-800',
    text: 'text-yellow-800 dark:text-yellow-200',
    icon: FiAlertCircle,
    iconColor: 'text-yellow-500',
  },
  info: {
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    border: 'border-blue-200 dark:border-blue-800',
    text: 'text-blue-800 dark:text-blue-200',
    icon: FiInfo,
    iconColor: 'text-blue-500',
  },
};

const AlertMessage = ({ type = 'info', message, onClose, show = true }) => {
  const style = alertStyles[type];
  // const Icon = style.icon;

  return (
    <AnimatePresence>
      {show && message && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className={`${style.bg} ${style.border} ${style.text} border rounded-xl p-4 flex items-start gap-3`}
        >
          {/* <Icon className={`${style.iconColor} text-xl flex-shrink-0 mt-0.5`} /> */}
          <p className="text-sm font-medium flex-1">{message}</p>
          {onClose && (
            <button
              onClick={onClose}
              className="flex-shrink-0 hover:opacity-70 transition-opacity cursor-pointer"
            >
              <FiX className="text-lg" />
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AlertMessage;