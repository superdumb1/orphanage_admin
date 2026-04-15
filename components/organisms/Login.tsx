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
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4">

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden"
      >

        {/* HEADER */}
        <div className="p-6 border-b border-zinc-100 text-center">
          <h2 className="text-2xl font-black text-zinc-900 tracking-tight">
            Admin Access
          </h2>
          <p className="text-sm text-zinc-500 font-medium mt-1">
            Sign in to continue
          </p>
        </div>

        {/* BODY */}
        <div className="p-6 flex flex-col gap-4">

          {/* ERROR */}
          {error && (
            <div className="bg-rose-50 border border-rose-100 text-rose-600 text-sm font-bold p-3 rounded-xl text-center">
              {error}
            </div>
          )}

          <FormField
            label="Email"
            type="email"
            id="email"
            required
            onChange={(e) => setEmail(e.target.value)}
          />

          <FormField
            label="Password"
            type="password"
            id="password"
            required
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button
            type="submit"
            className="bg-zinc-900 hover:bg-zinc-800 text-white font-bold py-2.5 rounded-xl mt-2"
          >
            Sign In
          </Button>
        </div>
      </form>
    </div>
  );
};