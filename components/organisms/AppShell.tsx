"use client";
import React from 'react';
import { useSession } from 'next-auth/react';
import { Sidebar } from './Sidebar';
import { Login } from './Login';

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Grab the real session status from NextAuth
  const { status } = useSession();

  // Show a blank screen or spinner while checking the cookie
  if (status === "loading") {
    return <div className="flex h-screen items-center justify-center bg-zinc-50">Loading...</div>;
  }

  // Block access if not logged in
  if (status === "unauthenticated") {
    return <Login />;
  }

  // If authenticated, render the dashboard shell
  return (
    <div className="flex h-screen w-full bg-zinc-50 overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-6">
        {children}
      </main>
    </div>
  );
};