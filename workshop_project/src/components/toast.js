// notification
import React, { useState, createContext, useContext } from 'react';

const ToastContext = createContext(null);
const TOAST_DURATION = 3000;

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);

  function triggerToast(newToast) {
    setToast(newToast);
    setTimeout(() => {
      setToast(null);
    }, TOAST_DURATION);
  }

  return (
    <ToastContext.Provider value={{ toast, triggerToast }}>
      {children}
      {toast && (
        <div
          onClick={() => setToast(null)}
          style={{
            position: 'fixed',
            top: '20%',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'red',
            color: 'white',
            padding: '1rem 2rem',
            borderRadius: '8px',
            zIndex: 1000,
            cursor: 'pointer',
          }}
        >
          {toast}
        </div>
      )}
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
