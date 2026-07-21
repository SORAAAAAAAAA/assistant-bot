import { useState } from 'react';
import './App.css';
import Modal from '@/components/Modal';
import ForgotPassword from '@/components/ForgotPassword';
import Login from '@/Login';
import Signup from '@/Signup';
import { useAuth } from '@/context/authContext';
import LogisticsChat from '@/pages/chat';
import Toast from '@/components/Toast';
import LoadingOverlay from '@/components/LoadingOverlay';

type ViewState = 'login' | 'signup' | 'forgotPassword';
type ToastType = 'success' | 'error';

function App() {
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
    return <LogisticsChat />;
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

export default App;
