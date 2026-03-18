import React, { createContext, useContext, useState, useCallback } from 'react';
import CustomModal from '../components/Common/CustomModal';

const ModalContext = createContext();

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};

export const ModalProvider = ({ children }) => {
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'confirm',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    placeholder: 'Enter value...',
    defaultValue: '',
    status: 'info',
    onConfirm: () => {},
    onClose: () => {}
  });

  const showModal = useCallback((options) => {
    return new Promise((resolve) => {
      setModalState({
        isOpen: true,
        title: options.title || 'Are you sure?',
        message: options.message || '',
        type: options.type || 'confirm',
        confirmText: options.confirmText || 'Confirm',
        cancelText: options.cancelText || 'Cancel',
        placeholder: options.placeholder || 'Enter value...',
        defaultValue: options.defaultValue || '',
        status: options.status || 'info',
        onConfirm: (value) => {
          options.onConfirm?.(value);
          resolve(value || true);
        },
        onClose: () => {
          options.onClose?.();
          resolve(false);
        }
      });
    });
  }, []);

  const hideModal = useCallback(() => {
    setModalState(prev => ({ ...prev, isOpen: false }));
  }, []);

  // Helpers for common modal types
  const confirm = (title, message, status = 'warning', confirmText = 'Confirm', cancelText = 'Cancel') => 
    showModal({ title, message, status, type: 'confirm', confirmText, cancelText });

  const prompt = (title, message, placeholder = '', defaultValue = '') => 
    showModal({ title, message, placeholder, defaultValue, type: 'prompt', status: 'info' });

  const alert = (title, message, status = 'info') => 
    showModal({ title, message, status, type: 'alert', confirmText: 'OK' });

  return (
    <ModalContext.Provider value={{ showModal, hideModal, confirm, prompt, alert }}>
      {children}
      <CustomModal 
        {...modalState} 
        onClose={hideModal}
        onConfirm={(value) => {
          modalState.onConfirm(value);
          hideModal();
        }}
      />
    </ModalContext.Provider>
  );
};
