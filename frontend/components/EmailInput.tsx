// components/EmailInput.tsx
import React from 'react';

interface EmailInputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export default function EmailInput({ className, ...props }: EmailInputProps) {
  return (
    <input
      type="email"
      className={`${className}`}
      {...props}
    />
  );
}