import { useState } from 'react';
import './App.css';
import Modal from './components/Modal';
import ForgotPassword from './components/ForgotPassword';
import Login from './Login';
import Signup from './Signup';

type ViewState = 'login' | 'signup' | 'forgotPassword';

function App() {
  const [currentView, setCurrentView] = useState<ViewState>('login');

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      fontFamily: 'sans-serif'
    }}>

      <Modal isOpen={true} onClose={() => { }}>

        {currentView === 'login' && (
          <Login
            onSwitchToSignup={() => setCurrentView('signup')}
            onSwitchToForgotPassword={() => setCurrentView('forgotPassword')}
          />
        )}

        {currentView === 'signup' && (
          <Signup
            onSwitchToLogin={() => setCurrentView('login')}
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
