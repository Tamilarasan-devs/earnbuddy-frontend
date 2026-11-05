import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { 
  CheckCircle2, 
  AlertCircle, 
  AlertTriangle, 
  Info, 
  X 
} from 'lucide-react';

const ModalContext = createContext(null);

export const ModalProvider = ({ children }) => {
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'info', // 'success' | 'error' | 'warning' | 'info'
    confirmText: 'Got It',
    cancelText: 'Cancel',
    isConfirm: false,
  });

  const resolverRef = useRef(null);

  const closeModal = useCallback((result = false) => {
    setModalState(prev => ({ ...prev, isOpen: false }));
    if (resolverRef.current) {
      resolverRef.current(result);
      resolverRef.current = null;
    }
  }, []);

  /**
   * Show alert dialog (returns a Promise that resolves when dismissed)
   */
  const showAlert = useCallback((optionsOrMsg, type = 'info', title = '') => {
    return new Promise((resolve) => {
      resolverRef.current = resolve;
      
      let config = {
        message: '',
        type: 'info',
        title: '',
        confirmText: 'Got It',
        isConfirm: false
      };

      if (typeof optionsOrMsg === 'string') {
        config.message = optionsOrMsg;
        config.type = type || 'info';
        config.title = title;
      } else if (typeof optionsOrMsg === 'object' && optionsOrMsg !== null) {
        config = { ...config, ...optionsOrMsg };
      }

      if (!config.title) {
        if (config.type === 'success') config.title = 'Success';
        else if (config.type === 'error') config.title = 'Attention';
        else if (config.type === 'warning') config.title = 'Warning';
        else config.title = 'Notice';
      }

      setModalState({
        isOpen: true,
        title: config.title,
        message: config.message,
        type: config.type,
        confirmText: config.confirmText || 'Got It',
        cancelText: 'Cancel',
        isConfirm: false,
      });
    });
  }, []);

  /**
   * Show confirmation dialog (returns a Promise<boolean>)
   */
  const showConfirm = useCallback((message, options = {}) => {
    return new Promise((resolve) => {
      resolverRef.current = resolve;
      setModalState({
        isOpen: true,
        title: options.title || 'Confirm Action',
        message: message || '',
        type: options.type || 'warning',
        confirmText: options.confirmText || 'Confirm',
        cancelText: options.cancelText || 'Cancel',
        isConfirm: true,
      });
    });
  }, []);

  // Theme mapping matching EarnBuddy sunset orange/crimson theme
  const getTheme = () => {
    switch (modalState.type) {
      case 'success':
        return {
          icon: <CheckCircle2 className="w-8 h-8 text-emerald-500" />,
          bgIcon: 'bg-emerald-50 border-emerald-100',
          btnBg: 'bg-gradient-to-r from-emerald-500 to-teal-600 shadow-emerald-500/25 hover:brightness-105',
        };
      case 'error':
        return {
          icon: <AlertCircle className="w-8 h-8 text-rose-500" />,
          bgIcon: 'bg-rose-50 border-rose-100',
          btnBg: 'bg-gradient-to-r from-rose-500 to-red-600 shadow-rose-500/25 hover:brightness-105',
        };
      case 'warning':
        return {
          icon: <AlertTriangle className="w-8 h-8 text-amber-500" />,
          bgIcon: 'bg-amber-50 border-amber-200',
          btnBg: 'bg-gradient-to-r from-amber-500 to-amber-600 shadow-amber-500/25 hover:brightness-105',
        };
      case 'info':
      default:
        return {
          icon: <Info className="w-8 h-8 text-[#EA580C]" />,
          bgIcon: 'bg-orange-50 border-orange-200',
          btnBg: 'bg-gradient-to-r from-[#EA580C] to-[#EF4444] shadow-orange-500/25 hover:brightness-105',
        };
    }
  };

  const theme = getTheme();

  return (
    <ModalContext.Provider value={{ showAlert, showConfirm, closeModal }}>
      {children}

      {/* Backdrop & Modal Dialog */}
      {modalState.isOpen && (
        <div 
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => !modalState.isConfirm && closeModal(false)}
        >
          <div 
            className="relative w-full max-w-sm sm:max-w-md rounded-[28px] bg-white p-6 sm:p-7 shadow-2xl border border-gray-100 text-center animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            {/* Close 'X' button */}
            <button
              type="button"
              onClick={() => closeModal(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-800 flex items-center justify-center transition cursor-pointer"
              aria-label="Close"
            >
              <X size={16} />
            </button>

            {/* Icon Banner */}
            <div className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border ${theme.bgIcon} shadow-xs`}>
              {theme.icon}
            </div>

            {/* Title */}
            <h3 className="text-xl font-black text-[#090A0F] tracking-tight">
              {modalState.title}
            </h3>

            {/* Message Content */}
            <p className="mt-2 text-sm font-semibold text-[#334155] leading-relaxed whitespace-pre-line px-1">
              {modalState.message}
            </p>

            {/* Actions */}
            <div className="mt-6 flex items-center gap-3">
              {modalState.isConfirm && (
                <button
                  type="button"
                  onClick={() => closeModal(false)}
                  className="flex-1 py-3 px-4 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-sm font-bold text-[#334155] transition cursor-pointer"
                >
                  {modalState.cancelText}
                </button>
              )}
              <button
                type="button"
                autoFocus
                onClick={() => closeModal(true)}
                className={`flex-1 py-3 px-4 rounded-xl text-white text-sm font-black transition cursor-pointer shadow-md ${theme.btnBg}`}
              >
                {modalState.confirmText}
              </button>
            </div>
          </div>
        </div>
      )}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};

export default ModalProvider;

