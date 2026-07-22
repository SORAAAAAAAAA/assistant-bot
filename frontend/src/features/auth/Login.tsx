import React, { useState } from 'react';
import PasswordInput from '@/features/auth/PasswordInput';
import EmailInput from '@/components/ui/EmailInput';
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
    const loginData: LoginRequest = {
      email: email,
      password: password,
    };
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

  const inputClasses = "w-full rounded-xl border border-slate-900/10 bg-white/60 px-4 py-3 text-[13px] text-slate-900 placeholder-slate-500 outline-none focus:bg-white focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20 transition-all";
  const labelClasses = "text-[11px] font-bold text-slate-800 uppercase tracking-wider mb-1 block text-left ml-1";

  return (
    <div className="flex flex-col text-slate-900 animate-view-change">
      <div className="text-left mb-5">
        <h2 className="text-2xl !font-extrabold tracking-wide !text-red-600">Log In</h2>
        <p className="mt-1 text-[13px] text-slate-600">Welcome back. Please log in to your account.</p>
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

        <div className="my-1 flex items-center justify-between text-[13px] text-slate-700 px-1">
          <label className="flex cursor-pointer items-center gap-2 select-none">
            <div className="relative flex items-center justify-center">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="peer h-3.5 w-3.5 appearance-none rounded border border-slate-900/30 bg-white/50 checked:bg-slate-900 checked:border-slate-900 focus:outline-none transition-all cursor-pointer"
              />
              <svg
                className="pointer-events-none absolute hidden peer-checked:block h-2.5 w-2.5 text-white"
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
            className="font-medium underline decoration-slate-900/30 underline-offset-2 transition-colors hover:text-red-600 hover:decoration-red-600"
          >
            Forgot password
          </button>
        </div>

        <button
          type="submit"
          className="mt-2 w-full rounded-xl bg-slate-900 py-3.5 text-sm font-semibold text-white shadow-md transition-colors hover:bg-red-600 active:bg-red-700"
        >
          Log In
        </button>
      </form>

      <div className="mt-5 text-center text-[13px] text-slate-700">
        Don't have an account?{' '}
        <button 
          onClick={onSwitchToSignup} 
          className="font-bold underline decoration-slate-900/30 underline-offset-2 transition-colors hover:text-red-600 hover:decoration-red-600"
        >
          Sign up
        </button>
      </div>
    </div>
  );
}