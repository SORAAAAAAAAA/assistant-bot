import React, { useState } from 'react';
import PasswordInput from '@/components/PasswordInput';
import EmailInput from '@/components/EmailInput';

interface LoginProps {
  onSwitchToSignup: () => void;
  onSwitchToForgotPassword: () => void;
}

export default function Login({ onSwitchToSignup, onSwitchToForgotPassword }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login attempt:', { email, password, rememberMe });
  };

  const inputClasses = "w-full rounded-xl border border-slate-900/10 bg-white/60 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-500 outline-none focus:bg-white focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20 transition-all";
  const labelClasses = "text-[10px] font-bold text-slate-800 uppercase tracking-wider mb-1.5 block text-left ml-1";

  return (
    <div className="flex flex-col text-slate-900">
      <div className="text-left mb-4">
        <h2 className="text-3xl font-medium tracking-wide text-red-500">Log In</h2>
        <p className="text-xs text-slate-600 mt-1">Welcome back. Please log in to your account.</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
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

        <div className="my-1 flex items-center justify-between text-xs text-slate-700 px-1">
          <label className="flex cursor-pointer items-center gap-2 select-none">
            <div className="relative flex items-center justify-center">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="peer h-4 w-4 appearance-none rounded border border-slate-900/30 bg-white/50 checked:bg-slate-900 checked:border-slate-900 focus:outline-none transition-all cursor-pointer"
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
            className="font-medium underline decoration-slate-900/30 underline-offset-2 transition-colors hover:text-slate-900"
          >
            Forgot password
          </button>
        </div>

        <button
          type="submit"
          className="mt-3 w-full rounded-xl bg-slate-900 py-3 text-sm font-semibold text-white shadow-md transition-colors hover:bg-slate-800 active:bg-slate-950"
        >
          Log In
        </button>
      </form>

      <div className="mt-4 text-center text-xs text-slate-700">
        Don't have an account?{' '}
        <button
          onClick={onSwitchToSignup}
          className="font-bold underline decoration-slate-900/30 underline-offset-2 transition-colors hover:text-slate-900"
        >
          Sign up
        </button>
      </div>
    </div>
  );
}