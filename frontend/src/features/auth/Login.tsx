import React, { useState } from 'react';
import PasswordInput from '@/features/auth/PasswordInput';
import EmailInput from '@/components/ui/EmailInput';
import Button from '@/components/ui/Button'; 
import { loginService } from '@/services/authService';
import type { LoginRequest } from '@ai-assistant/shared';
import { useAuth } from '@/context/authContext';

interface LoginProps {
  onSwitchToSignup: () => void;
  onSwitchToForgotPassword: () => void;
  onShowToast: (message: string, type: 'success' | 'error') => void;
  setIsLoading: (loading: boolean) => void;
}

export default function Login({ onSwitchToSignup, onSwitchToForgotPassword, onShowToast, setIsLoading }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const { login: contextLogin } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const loginData: LoginRequest = { email, password };
    const login = async () => {
      setIsLoading(true);
      try {
        const result = await loginService(loginData);
        setTimeout(() => {
          setIsLoading(false);
          contextLogin(result.access_token);
        }, 1000);
      } catch (error) {
        setIsLoading(false);
        if (error instanceof Error) {
          onShowToast(error.message, 'error');
        } else {
          onShowToast('An unknown error occurred', 'error');
        }
      }
    }
    login();
  };

  const inputClasses = "w-full rounded-xl border border-white/20 bg-black/20 px-4 py-3 text-[13px] text-white placeholder-white/40 outline-none focus:bg-black/40 focus:border-white/50 focus:ring-2 focus:ring-white/20 transition-all";
  const labelClasses = "text-[11px] font-bold text-white/70 uppercase tracking-wider mb-1 block text-left ml-1";

  return (
    <div className="flex flex-col animate-view-change">
      <div className="text-left mb-5">
        <h2 className="text-2xl font-extrabold tracking-wide text-white">Log In</h2>
        <p className="mt-1 text-[13px] text-white/70">Welcome back. Please log in to your account.</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
        <div>
          <label htmlFor="loginEmail" className={labelClasses}>Email Address</label>
          <EmailInput
            id="loginEmail"
            placeholder="name@company.com"
            className={inputClasses}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="loginPassword" className={labelClasses}>Password</label>
          <PasswordInput
            id="loginPassword"
            placeholder="••••••••"
            className={inputClasses}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="my-1 flex items-center justify-between text-[13px] px-1">
          <label className="flex cursor-pointer items-center gap-2 select-none text-white/80">
            <div className="relative flex items-center justify-center">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="peer h-3.5 w-3.5 appearance-none rounded border border-white/40 bg-black/20 checked:bg-white checked:border-white focus:outline-none transition-all cursor-pointer"
              />
              <svg
                className="pointer-events-none absolute hidden peer-checked:block h-2.5 w-2.5 text-[#0f172a]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="4"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span>Remember me</span>
          </label>

          <button 
            type="button"
            onClick={onSwitchToForgotPassword}
            className="font-medium text-white/80 underline decoration-white/30 underline-offset-2 transition-colors hover:text-white hover:decoration-white"
          >
            Forgot password
          </button>
        </div>

        {/* Utilizing the centralized Button component */}
        <Button type="submit" label="Log In" className="mt-2" />
      </form>

      <div className="mt-5 text-center text-[13px] text-white/70">
        Don't have an account?{' '}
        <button 
          onClick={onSwitchToSignup} 
          className="font-bold text-white underline decoration-white/30 underline-offset-2 transition-colors hover:decoration-white"
        >
          Sign up
        </button>
      </div>
    </div>
  );
}