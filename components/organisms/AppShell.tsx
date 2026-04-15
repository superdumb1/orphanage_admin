"use client";
import React from 'react';
import { useSession } from 'next-auth/react';
import { Sidebar } from './Sidebar';
import { Login } from './Login';

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { status } = useSession();

  // 1. Loading State (Theme-Aware)
  if (status === "loading") {
    return (
      <div className="flex h-screen items-center justify-center bg-bg text-text transition-colors duration-500">
        <div className="flex flex-col items-center gap-4">
           {/* Spinner using primary color and glow effect */}
           <div className="w-10 h-10 border-4 border-primary/10 border-t-primary rounded-full animate-spin shadow-glow" />
           <p className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted animate-pulse">
             Initializing
           </p>
        </div>
      </div>
    );
  }

  // 2. Unauthenticated
  if (status === "unauthenticated") {
    return <Login />;
  }

  // 3. Authenticated Dashboard Shell
  return (
    <div className="flex h-screen w-full bg-bg text-text overflow-hidden transition-colors duration-500">
      
      {/* Sidebar remains fixed width */}
      <Sidebar />

      <main className="flex-1 overflow-y-auto bg-shaded/50 transition-colors duration-500">
        <div className="max-w-[1600px] mx-auto p-8">
          {children}
        </div>
      </main>

    </div>
  );
};