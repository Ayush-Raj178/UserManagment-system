import React, { useState, useEffect, createContext, useContext, useCallback } from 'react';
import PropTypes from 'prop-types';
import { createPortal } from 'react-dom';

// Toast Context
const ToastContext = createContext(null);

// Toast Types
const TOAST_TYPES = {
  success: {
    icon: '✓',
    className: 'bg-green-500',
  },
  error: {
    icon: '✕',
    className: 'bg-red-500',
  },
  warning: {
    icon: '!',
    className: 'bg-yellow-500',
  },
  info: {
    icon: 'i',
    className: 'bg-blue-500',
  },
};

// Individual Toast Component
const Toast = ({ message, type, onClose, duration = 5000 }) => {
  useEffect(() => {
    if (duration) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const { icon, className } = TOAST_TYPES[type];

  return (
    <div
      className={`${className} text-white p-4 rounded-lg shadow-lg flex items-center justify-between min-w-[300px] max-w-md animate-slide-in`}
      role="alert"
    >
      <div className="flex items-center space-x-3">
        <span className="font-bold">{icon}</span>
        <p>{message}</p>
      </div>
      <button
        onClick={onClose}
        className="text-white hover:text-gray-200 focus:outline-none"
        aria-label="Close notification"
      >
        ✕
      </button>
    </div>
  );
};

Toast.propTypes = {
  message: PropTypes.string.isRequired,
  type: PropTypes.oneOf(Object.keys(TOAST_TYPES)).isRequired,
  onClose: PropTypes.func.isRequired,
  duration: PropTypes.number,
};

// Toast Container Component
const ToastContainer = ({ toasts, removeToast }) => {
  return createPortal(
    <div
      className="fixed top-4 right-4 z-50 space-y-4"
      role="region"
      aria-label="Notifications"
    >
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
          duration={toast.duration}
        />
      ))}
    </div>,
    document.body
  );
};

ToastContainer.propTypes = {
  toasts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      message: PropTypes.string.isRequired,
      type: PropTypes.oneOf(Object.keys(TOAST_TYPES)).isRequired,
      duration: PropTypes.number,
    })
  ).isRequired,
  removeToast: PropTypes.func.isRequired,
};

// Toast Provider Component
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback(
    ({ message, type = 'info', duration = 5000 }) => {
      const id = Math.random().toString(36).substr(2, 9);
      setToasts((currentToasts) => [...currentToasts, { id, message, type, duration }]);
    },
    []
  );

  const removeToast = useCallback((id) => {
    setToasts((currentToasts) => currentToasts.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
};

ToastProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// Hook to use toast
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

// Add styles to index.css
const style = document.createElement('style');
style.textContent = `
  @keyframes slide-in {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  .animate-slide-in {
    animation: slide-in 0.3s ease-out;
  }
`;
document.head.appendChild(style); 