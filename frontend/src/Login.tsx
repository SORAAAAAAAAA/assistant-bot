import React, { useState } from 'react';
import PasswordInput from '../components/PasswordInput'; 
import EmailInput from '../components/EmailInput'; // Import the new component

interface LoginProps {
  onSwitchToSignup: () => void;
}

export default function Login({ onSwitchToSignup }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login attempt:', { email, password, rememberMe });
  };

  const inputClasses = "w-full rounded-xl bg-white/20 px-4 py-2.5 text-sm text-white placeholder-white/70 outline-none focus:bg-white/30 transition-colors";
  // SYNCED: mb-1 (matches Signup layout exactly)
  const labelClasses = "text-[10px] font-semibold text-white/80 uppercase tracking-wider mb-1 block";

  return (
    <div className="flex flex-col text-white">
      <div className="text-left mb-4">
        <h2 className="text-3xl font-medium tracking-wide">Log In</h2>
        <p className="text-xs text-white/80">Welcome back. Please log in to your account.</p>
      </div>

      {/* SYNCED: Changed gap-4 to gap-3 to match Signup layout */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        
        {/* Reusable Email Input */}
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
        
        {/* Reusable Password Input */}
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

        <div className="my-1 flex items-center justify-between text-xs text-white/90">
          <label className="flex cursor-pointer items-center gap-2 select-none">
            <div className="relative flex items-center justify-center">
              <input 
                type="checkbox" 
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="peer h-4 w-4 appearance-none rounded border border-white/50 bg-white/10 checked:bg-white/30 checked:border-white focus:outline-none transition-all cursor-pointer" 
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
          <a href="#" className="underline decoration-white/50 underline-offset-2 transition-colors hover:text-white">
            Forgot password
          </a>
        </div>

        <button 
          type="submit" 
          className="mt-2 rounded-full border border-white/50 bg-transparent py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/10"
        >
          Log In
        </button>
      </form>

      <div className="mt-4 text-center text-xs text-white/90">
        Don't have an account?{' '}
        <button 
          onClick={onSwitchToSignup} 
          className="font-medium underline decoration-white/50 underline-offset-2 transition-colors hover:text-white"
        >
          Sign up
        </button>
      </div>
    </div>
  );
}