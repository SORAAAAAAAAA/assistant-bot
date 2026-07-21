import React, { useState } from 'react';
import EmailInput from '@/components/ui/EmailInput';

interface ForgotPasswordProps {
  onBackToLogin: () => void;
}

export default function ForgotPassword({ onBackToLogin }: ForgotPasswordProps) {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Password reset requested for:', email);
    setIsSubmitted(true);
  };

  const inputClasses = "w-full rounded-xl border border-slate-900/10 bg-white/60 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-500 outline-none focus:bg-white focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20 transition-all";
  const labelClasses = "text-[10px] font-bold text-slate-800 uppercase tracking-wider mb-1.5 block text-left ml-1";

  return (
    <div className="flex flex-col text-slate-900">
      <div className="text-left mb-4">
        <h2 className="text-3xl !font-extrabold tracking-wide !text-red-600">Reset Password</h2>
        <p className="text-xs text-slate-600 mt-1">
          {isSubmitted
            ? "Check your email for instructions."
            : "Enter your email and we'll send a reset link."}
        </p>
      </div>

      {!isSubmitted ? (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div>
            <label htmlFor="resetEmail" className={labelClasses}>Email Address</label>
            <EmailInput
              id="resetEmail"
              placeholder="name@company.com"
              className={inputClasses}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="mt-3 w-full rounded-xl bg-slate-900 py-3 text-sm font-semibold text-white shadow-md transition-colors hover:bg-red-600 active:bg-red-700"
          >
            Send Reset Link
          </button>
        </form>
      ) : (
        <div className="mt-2 rounded-xl bg-white/60 p-5 border border-slate-900/10 text-sm text-center shadow-sm">
          <p>A confirmation link has been sent to</p>
          <p className="font-bold text-slate-800 mt-1">{email}</p>
        </div>
      )}

      <div className="mt-4 text-center text-xs text-slate-700">
        Remember your password?{' '}
        <button
          onClick={onBackToLogin}
          className="font-bold underline decoration-slate-900/30 underline-offset-2 transition-colors hover:text-red-600 hover:decoration-red-600"
        >
          Log In
        </button>
      </div>
    </div>
  );
}