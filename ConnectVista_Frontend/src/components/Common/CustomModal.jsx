import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle2, XCircle, HelpCircle, X, Info } from 'lucide-react';

const CustomModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  type = 'confirm', // 'confirm', 'prompt', 'alert', 'info'
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  placeholder = 'Enter value...',
  defaultValue = '',
  status = 'info' // 'info', 'success', 'warning', 'error'
}) => {
  const [inputValue, setInputValue] = useState(defaultValue);

  useEffect(() => {
    if (isOpen) {
      setInputValue(defaultValue);
    }
  }, [isOpen, defaultValue]);

  const handleConfirm = () => {
    if (type === 'prompt') {
      onConfirm(inputValue);
    } else {
      onConfirm();
    }
    onClose();
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'success': return <CheckCircle2 className="w-12 h-12 text-green-500" />;
      case 'warning': return <AlertCircle className="w-12 h-12 text-yellow-500" />;
      case 'error': return <XCircle className="w-12 h-12 text-red-500" />;
      default: return <Info className="w-12 h-12 text-blue-500" />;
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative"
        >
          {/* Close button */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>

          <div className="p-8 flex flex-col items-center text-center">
            <div className="mb-4">
              {getStatusIcon()}
            </div>
            
            <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
            <p className="text-gray-600 mb-6">{message}</p>

            {type === 'prompt' && (
              <div className="w-full mb-6">
                <input
                  autoFocus
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={placeholder}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>
            )}

            <div className="flex gap-3 w-full">
              {type !== 'alert' && type !== 'info' && (
                <button
                  onClick={onClose}
                  className="flex-1 px-6 py-3 rounded-xl border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-all active:scale-95"
                >
                  {cancelText}
                </button>
              )}
              <button
                onClick={handleConfirm}
                className={`flex-1 px-6 py-3 rounded-xl text-white font-semibold transition-all active:scale-95 shadow-lg ${
                  status === 'error' ? 'bg-red-500 hover:bg-red-600 shadow-red-200' :
                  status === 'warning' ? 'bg-yellow-500 hover:bg-yellow-600 shadow-yellow-200' :
                  status === 'success' ? 'bg-green-500 hover:bg-green-600 shadow-green-200' :
                  'bg-blue-600 hover:bg-blue-700 shadow-blue-200'
                }`}
              >
                {confirmText}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CustomModal;
