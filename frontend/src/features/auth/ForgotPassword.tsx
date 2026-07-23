import React, { useState } from 'react';
import EmailInput from '@/components/ui/EmailInput';
import Button from '@/components/ui/Button'; // 

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

  const inputClasses = "w-full rounded-xl border border-white/20 bg-black/20 px-4 py-3 text-[13px] text-white placeholder-white/40 outline-none focus:bg-black/40 focus:border-white/50 focus:ring-2 focus:ring-white/20 transition-all";
  const labelClasses = "text-[11px] font-bold text-white/70 uppercase tracking-wider mb-1 block text-left ml-1";

  return (
    <div className="flex flex-col animate-view-change">
      <div className="text-left mb-5">
         <h2 className="text-2xl font-extrabold tracking-wide text-white">Reset Password</h2>
        <p className="text-[13px] text-white/70 mt-1">
          {isSubmitted 
            ? "Check your email for instructions." 
            : "Enter your email and we'll send a reset link."}
        </p>
      </div>

      {!isSubmitted ? (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
          
         {/* Utilizing the centralized Button component */}
         <Button type="submit" label="Send Reset Link" className="mt-1" />
        </form>
      ) : (
        <div className="mt-2 rounded-xl bg-black/20 p-5 border border-white/10 text-[13px] text-center shadow-sm text-white/80">
          <p>A confirmation link has been sent to</p>
          <p className="font-bold text-white mt-1 text-[15px]">{email}</p>
        </div>
      )}

      <div className="mt-5 text-center text-[13px] text-white/70">
        Remember your password?{' '}
        <button 
          onClick={onBackToLogin} 
          className="font-bold text-white underline decoration-white/30 underline-offset-2 transition-colors hover:decoration-white"
        >
          Log In
        </button>
      </div>
    </div>
  );
}