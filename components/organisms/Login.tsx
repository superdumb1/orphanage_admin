"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { FormField } from "../molecules/FormField";
import { Button } from "../atoms/Button";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError("Invalid email or password");
    }
  };

  return (
    // Updated: bg-zinc-50 -> bg-bg (transitions smoothly)
    <div className="flex min-h-screen items-center justify-center bg-bg px-4 transition-colors duration-500">

      {/* Form Container: Updated to bg-card and border-border */}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-card border border-border rounded-dashboard shadow-glow overflow-hidden"
      >

        {/* HEADER: Updated text colors */}
        <div className="p-8 border-b border-border text-center">
          <h2 className="text-2xl font-black text-text tracking-tight">
            Admin Access
          </h2>
          <p className="text-sm text-text-muted font-medium mt-1">
            Sign in to continue
          </p>
        </div>

        {/* BODY */}
        <div className="p-8 flex flex-col gap-5">

          {/* ERROR: Updated to use your 'danger' theme tokens */}
          {error && (
            <div className="bg-danger/10 border border-danger/20 text-danger text-sm font-bold p-4 rounded-xl text-center">
              {error}
            </div>
          )}

          <FormField
            label="Email"
            type="email"
            id="email"
            required
            className="text-text" // Ensure FormField internal text is themed
            onChange={(e) => setEmail(e.target.value)}
          />

          <FormField
            label="Password"
            type="password"
            id="password"
            required
            className="text-text"
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* Button: Switched to your btn-primary utility or theme tokens */}
          <Button
            type="submit"
            className="btn-primary w-full mt-2"
          >
            Sign In
          </Button>
        </div>
      </form>
    </div>
  );
};