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
           {/* Simple CSS spinner using your primary color */}
           <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
           <p className="text-xs font-black uppercase tracking-[0.2em] opacity-50">Initializing</p>
        </div>
      </div>
    );
  }

  // 2. Unauthenticated (Login usually handles its own theme)
  if (status === "unauthenticated") {
    return <Login />;
  }

  // 3. Authenticated Dashboard Shell
  return (
    <div className="flex h-screen w-full bg-bg text-text overflow-hidden transition-colors duration-500">
      
      {/* Sidebar (Ensure your Sidebar component also uses bg-card or bg-shaded) */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-6 bg-shaded/30">
        {/* Container for content to keep it centered or max-width if needed */}
        <div className="max-w-[1600px] mx-auto">
          {children}
        </div>
      </main>

    </div>
  );
};