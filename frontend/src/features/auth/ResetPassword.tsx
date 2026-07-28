import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PasswordInput from '@/features/auth/PasswordInput';
import Button from '@/components/ui/Button';
import Toast from '@/components/ui/Toast';
import LoadingOverlay from '@/features/auth/LoadingOverlay';
import { resetPasswordService } from '@/services/authService';
import Modal from '@/components/ui/Modal';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [toastConfig, setToastConfig] = useState({ isVisible: false, message: '', type: 'success' as 'success' | 'error' });
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      showToast('Invalid or missing reset token', 'error');
    }
  }, [token]);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToastConfig({ isVisible: true, message, type });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    if (password !== confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }

    if (password.length < 8) {
      showToast('Password must be at least 8 characters long', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const response = await resetPasswordService(token, password);
      showToast(response.message, 'success');
      setTimeout(() => navigate('/'), 2000); // Redirect to login
    } catch (error: any) {
      showToast(error.message || 'Failed to reset password', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const inputClasses = "w-full rounded-xl border border-white/20 bg-black/20 px-4 py-3 text-[13px] text-white placeholder-white/40 outline-none focus:bg-black/40 focus:border-white/50 focus:ring-2 focus:ring-white/20 transition-all";
  const labelClasses = "text-[11px] font-bold text-white/70 uppercase tracking-wider mb-1 block text-left ml-1";

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
        onClose={() => setToastConfig(prev => ({ ...prev, isVisible: false }))}
      />
      {isLoading && <LoadingOverlay message="Resetting Password..." />}

      <Modal isOpen={true} onClose={() => { }}>
        <div className="flex flex-col animate-view-change">
          <div className="text-left mb-5">
            <h2 className="text-2xl font-extrabold tracking-wide text-white">Create New Password</h2>
            <p className="text-[13px] text-white/70 mt-1">
              Please enter your new password below.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label htmlFor="newPassword" className={labelClasses}>New Password</label>
              <PasswordInput
                id="newPassword"
                placeholder="********"
                className={inputClasses}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className={labelClasses}>Confirm New Password</label>
              <PasswordInput
                id="confirmPassword"
                placeholder="********"
                className={inputClasses}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" label="Reset Password" className="mt-1" disabled={!token} />
          </form>

          <div className="mt-5 text-center text-[13px] text-white/70">
            <button
              onClick={() => navigate('/')}
              className="font-bold text-white underline decoration-white/30 underline-offset-2 transition-colors hover:decoration-white"
            >
              Back to Log In
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
