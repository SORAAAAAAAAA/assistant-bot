import React, { useState } from 'react';
import PasswordInput from '@/features/auth/PasswordInput';
import EmailInput from '@/components/ui/EmailInput';
import CustomSelect from '@/features/chat/CustomSelect';
import { registerService } from '@/services/authService';
import type { RegisterRequest, DepartmentType } from '@ai-assistant/shared';

interface SignupProps {
  onSwitchToLogin: () => void;
  onShowToast: (message: string, type: 'success' | 'error') => void;
  setIsLoading: (loading: boolean) => void;
}

export default function Signup({ onSwitchToLogin, onShowToast, setIsLoading }: SignupProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    department: '',
    email: '',
    password: '',
    confirmPassword: '',
  });


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDepartmentChange = (val: string) => {
    setFormData((prev) => ({ ...prev, department: val }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const registerData: RegisterRequest = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      department: formData.department as DepartmentType,
      password: formData.password,
      confirmPassword: formData.confirmPassword,
    };

    const register = async () => {
      setIsLoading(true);
      try {
        const result = await registerService(registerData);

        onShowToast(result.message, 'success');

        setTimeout(() => {
          setIsLoading(false);
          onSwitchToLogin();
        }, 1200);

      } catch (error) {
        setIsLoading(false);
        if (error instanceof Error) {
          onShowToast(error.message, 'error');
        } else {
          onShowToast('An unknown error occurred', 'error');
        }
      }
    }
    register();
  };

  const departmentOptions = ["MIS", "OJS", "HR", "OOS", "GA", "Finance"];

  // MICRO-ADJUSTMENT: py-3 adds just a tiny bit of height back to the boxes
  const inputClasses = "w-full rounded-xl border border-slate-900/10 bg-white/60 px-4 py-3 text-[13px] text-slate-900 placeholder-slate-500 outline-none focus:bg-white focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20 transition-all";
  const labelClasses = "text-[11px] font-bold text-slate-800 uppercase tracking-wider mb-1 block text-left ml-1";

  return (
    <div className="flex flex-col text-slate-900 animate-view-change">
      <div className="text-left mb-4">
        <h2 className="text-2xl !font-extrabold tracking-wide !text-red-600">Sign Up</h2>
        <p className="text-[13px] text-slate-600 mt-1">Create an account to get started.</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">

        <div className="flex gap-3">
          <div className="flex-1">
            <label htmlFor="firstName" className={labelClasses}>First Name</label>
            <input
              id="firstName" name="firstName" type="text" placeholder="John"
              className={inputClasses} value={formData.firstName} onChange={handleChange} required
            />
          </div>
          <div className="flex-1">
            <label htmlFor="lastName" className={labelClasses}>Last Name</label>
            <input
              id="lastName" name="lastName" type="text" placeholder="Doe"
              className={inputClasses} value={formData.lastName} onChange={handleChange} required
            />
          </div>
        </div>

        <div className="flex gap-3">
          <div className="flex-1">
            <label className={labelClasses}>Department</label>
            <CustomSelect
              value={formData.department}
              onChange={handleDepartmentChange}
              options={departmentOptions}
              placeholder="Select Dept"
            />
          </div>
          <div className="flex-1">
            <label htmlFor="email" className={labelClasses}>Email Address</label>
            <EmailInput
              id="email" name="email" placeholder="name@company.com"
              className={inputClasses} value={formData.email} onChange={handleChange} required
            />
          </div>
        </div>

        <div className="flex gap-3">
          <div className="flex-1">
            <label htmlFor="password" className={labelClasses}>Password</label>
            <PasswordInput
              id="password" name="password" placeholder="••••••••"
              className={inputClasses} value={formData.password} onChange={handleChange} required
            />
          </div>
          <div className="flex-1">
            <label htmlFor="confirmPassword" className={labelClasses}>Confirm Password</label>
            <PasswordInput
              id="confirmPassword" name="confirmPassword" placeholder="••••••••"
              className={inputClasses} value={formData.confirmPassword} onChange={handleChange} required
            />
          </div>
        </div>

        {/* MICRO-ADJUSTMENT: py-3.5 makes the button match the inputs proportionally */}
        <button 
          type="submit" 
          className="mt-1 w-full rounded-xl bg-slate-900 py-3.5 text-sm font-semibold text-white shadow-md transition-colors hover:bg-red-600 active:bg-red-700"
        >
          Create Account
        </button>
      </form>

      <div className="mt-4 text-center text-[13px] text-slate-700">
        Already have an account?{' '}
        <button 
          onClick={onSwitchToLogin} 
          className="font-bold underline decoration-slate-900/30 underline-offset-2 transition-colors hover:text-red-600 hover:decoration-red-600"
        >
          Log In
        </button>
      </div>
    </div>
  );
}