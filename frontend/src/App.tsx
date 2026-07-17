import { useState } from 'react';
import './App.css';
import Modal from '../components/Modal';
import Login from './login';
import Signup from './signup';

function App() {
  // We only need to track if we are looking at Login or Signup
  const [isLoginView, setIsLoginView] = useState(true);

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh', 
      // Point this to where you saved the new white/orange/red blob image
      backgroundImage: 'url("/bg-blobs.png")', 
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      fontFamily: 'sans-serif'
    }}>
      
      {/* The Modal loads instantly and cannot be closed */}
      <Modal isOpen={true} onClose={() => {}}>
        {isLoginView ? (
          <Login onSwitchToSignup={() => setIsLoginView(false)} />
        ) : (
          <Signup onSwitchToLogin={() => setIsLoginView(true)} />
        )}
      </Modal>
      
    </div>
  );
}

export default App;