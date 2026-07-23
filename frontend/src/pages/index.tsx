import { useState } from 'react';
import Modal from '@/components/ui/Modal';
import ForgotPassword from '@/features/auth/ForgotPassword';
import Login from '@/features/auth/Login';
import Signup from '@/features/auth/Signup';
import { useAuth } from '@/context/authContext';
import { Navigate } from 'react-router-dom';
import Toast from '@/components/ui/Toast';
import LoadingOverlay from '@/features/auth/LoadingOverlay';
type ViewState = 'login' | 'signup' | 'forgotPassword';
type ToastType = 'success' | 'error';

export default function IndexPage() {
  const [currentView, setCurrentView] = useState<ViewState>('login');
  const { isAuthenticated } = useAuth();
  const [toastConfig, setToastConfig] = useState({
    isVisible: false,
    message: '',
    type: 'success' as ToastType
  });
  const [isLoading, setIsLoading] = useState(false);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToastConfig({ isVisible: true, message, type });
  };

  const hideToast = () => {
    setToastConfig(prev => ({ ...prev, isVisible: false }));
  };

  if (isAuthenticated) {
    return <Navigate to="/chat" replace />;
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      fontFamily: 'sans-serif'
    }}>
      <Toast
        isVisible={toastConfig.isVisible}
        message={toastConfig.message}
        type={toastConfig.type}
        onClose={hideToast}
      />

      {isLoading && <LoadingOverlay />}

      <Modal isOpen={true} onClose={() => { }}>

        {currentView === 'login' && (
          <Login
            onSwitchToSignup={() => setCurrentView('signup')}
            onSwitchToForgotPassword={() => setCurrentView('forgotPassword')}
            onShowToast={showToast}
            setIsLoading={setIsLoading}
          />
        )}

        {currentView === 'signup' && (
          <Signup
            onSwitchToLogin={() => setCurrentView('login')}
            onShowToast={showToast}
            setIsLoading={setIsLoading}
          />
        )}

        {currentView === 'forgotPassword' && (
          <ForgotPassword
            onBackToLogin={() => setCurrentView('login')}
          />
        )}

      </Modal>
    </div>
  );
}
