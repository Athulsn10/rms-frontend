import { useState } from 'react';

export type AlertType = 'success' | 'error' | 'warning' | 'info';

interface AlertState {
  message: string;
  type: AlertType;
  show: boolean;
}

export const useAlert = () => {
  const [alert, setAlert] = useState<AlertState>({
    message: '',
    type: 'info',
    show: false,
  });

  const showAlert = (message: string, type: AlertType) => {
    setAlert({ message, type, show: true });
    setTimeout(() => {
      setAlert(prev => ({ ...prev, show: false }));
    }, 5000);
  };

  const hideAlert = () => {
    setAlert(prev => ({ ...prev, show: false }));
  };

  return { alert, showAlert, hideAlert };
};