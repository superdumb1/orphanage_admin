"use client";
import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { FormField } from '../molecules/FormField';
import { Button } from '../atoms/Button';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // redirect: false prevents the page from reloading if it fails
    const res = await signIn('credentials', { email, password, redirect: false });
    
    if (res?.error) {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-zinc-50 px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm p-8 bg-white rounded-xl shadow-sm border border-zinc-200 flex flex-col gap-4">
        <h2 className="text-2xl font-bold text-zinc-900 text-center mb-2">Admin Access</h2>
        
        {error && <div className="text-sm text-red-500 text-center">{error}</div>}
        
        <FormField label="Email" type="email" id="email" required onChange={(e) => setEmail(e.target.value)} />
        <FormField label="Password" type="password" id="password" required onChange={(e) => setPassword(e.target.value)} />
        
        <Button type="submit" className="mt-4 py-2.5">Sign In</Button>
      </form>
    </div>
  );
};