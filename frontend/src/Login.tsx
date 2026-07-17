import React from 'react';
import Button from '../components/Button';

interface LoginProps {
  onSwitchToSignup: () => void;
}

export default function Login({ onSwitchToSignup }: LoginProps) {
  const inputStyle = {
    padding: '14px 16px', borderRadius: '12px', border: 'none',
    backgroundColor: '#E5E7EB', fontSize: '14px', width: '100%',
    boxSizing: 'border-box' as const, outline: 'none', color: '#111827'
  };
  const labelStyle = {
    fontSize: '10px', color: '#6B7280', fontWeight: 'bold',
    textTransform: 'uppercase' as const, marginBottom: '6px',
    display: 'block', letterSpacing: '0.5px'
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      
      {/* Tabs */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '50px', marginBottom: '8px' }}>
        <span style={{ cursor: 'default', color: '#111827', fontSize: '14px', fontWeight: 'bold', borderBottom: '2px solid #111827', paddingBottom: '4px' }}>Sign In</span>
        <span onClick={onSwitchToSignup} style={{ cursor: 'pointer', color: '#9CA3AF', fontSize: '14px', fontWeight: 'bold' }}>Sign Up</span>
      </div>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '8px' }}>
        <h2 style={{ color: '#C90016', margin: '0 0 6px 0', fontSize: '14px' }}>Welcome Back</h2>
        <p style={{ color: '#6B7280', fontSize: '12px', margin: 0 }}>Logistics Intelligence Portal</p>
      </div>

      {/* Form Fields */}
      <form style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div>
          <label style={labelStyle}>Email Address</label>
          <input type="email" placeholder="name@company.com" style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Password</label>
          <input type="password" placeholder="••••••••" style={inputStyle} />
        </div>

        {/* Using the default Red button for Sign In */}
        <Button label="Sign In" style={{ marginTop: '8px' }} />
      </form>

      {/* Divider */}
      <div style={{ textAlign: 'center', margin: '4px 0', fontSize: '10px', color: '#9CA3AF', textTransform: 'uppercase', fontWeight: 'bold' }}>
        Or continue with
      </div>

      {/* Social Login Buttons */}
      <div style={{ display: 'flex', gap: '12px' }}>
        <button style={{ flex: 1, padding: '12px', borderRadius: '12px', border: 'none', backgroundColor: '#E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold', color: '#374151' }}>
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" width="16" /> Google
        </button>
        <button style={{ flex: 1, padding: '12px', borderRadius: '12px', border: 'none', backgroundColor: '#E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold', color: '#374151' }}>
          <img src="https://www.svgrepo.com/show/475661/microsoft-color.svg" alt="Microsoft" width="16" /> Microsoft
        </button>
      </div>
    </div>
  );
}