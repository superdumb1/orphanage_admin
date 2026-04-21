"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { FormField } from "../molecules/FormField";
import { Button } from "../atoms/Button";
import { Loader2, ShieldCheck } from "lucide-react"; // Nice icons for the "Admin" feel

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Added loading state

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true); // Start loading

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("Invalid credentials. Access Denied.");
        setIsLoading(false); // Reset on error
      } else {
        // Force a slight delay for that "Syncing" feel if you want, 
        // or just let NextAuth handle the redirect.
        window.location.href = "/dashboard"; 
      }
    } catch (err) {
      setError("System connection failure.");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-4 transition-colors duration-500">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-card border border-border rounded-dashboard shadow-glow overflow-hidden"
      >
        <div className="p-8 border-b border-border text-center bg-shaded/30">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-4 border border-primary/20">
             <ShieldCheck className="text-primary" size={24} />
          </div>
          <h2 className="text-xl font-black text-text uppercase tracking-widest">
            Identity Protocol
          </h2>
          <p className="text-[10px] text-text-muted font-bold uppercase tracking-tighter mt-1 opacity-60">
            Secure Admin Gateway
          </p>
        </div>

        <div className="p-8 flex flex-col gap-6">
          {error && (
            <div className="bg-danger/10 border border-danger/20 text-danger text-[10px] font-black p-4 rounded-xl text-center uppercase tracking-widest animate-in shake-1">
              ⚠ {error}
            </div>
          )}

          <div className="space-y-4">
            <FormField
              label="Admin Email"
              type="email"
              placeholder="name@kree-corp.com"
              required
              onChange={(e) => setEmail(e.target.value)}
            />

            <FormField
              label="Access Key"
              type="password"
              placeholder="••••••••"
              required
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className={`w-full h-14 relative overflow-hidden transition-all duration-300 ${
                isLoading 
                ? "bg-primary/20 text-primary border-primary/30 cursor-not-allowed" 
                : "btn-primary shadow-glow hover:scale-[1.02] active:scale-[0.98]"
            }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-3">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-[11px] font-black uppercase tracking-[0.2em]">Verifying...</span>
              </div>
            ) : (
              <span className="text-[11px] font-black uppercase tracking-[0.2em]">Authorize Access</span>
            )}
          </Button>
        </div>
        
        <div className="p-4 bg-shaded/20 text-center border-t border-border/50">
            <p className="text-[9px] text-text-muted font-bold uppercase tracking-widest opacity-40">
                Authorized Personnel Only
            </p>
        </div>
      </form>
    </div>
  );
};