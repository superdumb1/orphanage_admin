"use client";

import React from "react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { ThemeToggle } from "../molecules/ThemeToggle";

export const Sidebar = () => {
  const navItems = [
    { label: "Dashboard", path: "/" },
    { label: "Children", path: "/children" },
    { label: "Staff", path: "/staff" },
    { label: "Finances", path: "/finance" },
    { label: "Inventory", path: "/inventory" },
    { label: "Accounts Headers", path: "/accounts_headers" },
    { label: "Guardians", path: "/guardians" },
  ];

  return (
    <aside className="w-64 h-full flex flex-col bg-bg-primary border-r border-zinc-200">

      {/* BRAND */}
      <div className="p-6 border-b border-zinc-100">
        <h1 className="text-lg font-black text-zinc-900 tracking-tight">
          OrphanAdmin
        </h1>
        <p className="text-xs text-zinc-500 font-medium mt-1">
          Management System
        </p>
      </div>

      {/* NAV */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <Link key={item.path} href={item.path}>
            <div className="px-4 py-2 rounded-xl text-sm font-medium text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 transition">
              {item.label}
            </div>
          </Link>
        ))}
      </nav>

      {/* FOOTER CONTROLS */}
      <div className="p-4 border-t border-zinc-100 space-y-3">

        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-zinc-500">
            Theme
          </span>
          <ThemeToggle />
        </div>

        <button
          onClick={() => signOut()}
          className="w-full px-4 py-2 rounded-xl text-sm font-bold text-rose-600 hover:bg-rose-50 transition text-left"
        >
          Logout
        </button>
      </div>
    </aside>
  );
};