"use client";

import React from "react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { ThemeToggle } from "../molecules/ThemeToggle";
import { usePathname } from "next/navigation"; // Added for active states

export const Sidebar = () => {
  const pathname = usePathname();

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
    // Changed bg-bg-primary to bg-bg and border-zinc-200 to border-border
    <aside className="w-64 h-full flex flex-col bg-bg border-r border-border transition-colors duration-500">

      {/* BRAND */}
      <div className="p-6 border-b border-border">
        <h1 className="text-lg font-black text-text tracking-tight">
          OrphanAdmin
        </h1>
        <p className="text-xs text-text-muted font-medium mt-1">
          Management System
        </p>
      </div>

      {/* NAV */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link key={item.path} href={item.path}>
              <div className={`px-4 py-2 rounded-xl text-sm font-medium transition-all
                ${isActive 
                  ? "bg-primary text-text-invert" 
                  : "text-text-muted hover:bg-shaded hover:text-text"
                }`}
              >
                {item.label}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* FOOTER CONTROLS */}
      <div className="p-4 border-t border-border space-y-3">
        <div className="flex items-center justify-between px-2">
          <span className="text-xs font-medium text-text-muted">
            Theme
          </span>
          <ThemeToggle />
        </div>

        <button
          onClick={() => signOut()}
          // Changed text-rose-600 to text-danger
          className="w-full px-4 py-2 rounded-xl text-sm font-bold text-danger hover:bg-danger/10 transition text-left"
        >
          Logout
        </button>
      </div>
    </aside>
  );
};