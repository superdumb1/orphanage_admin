"use client";

import React, { useState } from "react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "../molecules/ThemeToggle";
import {
  LayoutDashboard,
  Baby,
  UserCog,
  Wallet,
  Package,
  BookOpen,
  Shield,
  LogOut,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

export const Sidebar = () => {
  const pathname = usePathname();
  // 1. Add state to track if the sidebar is shrunk
  const [isCollapsed, setIsCollapsed] = useState(false);

  // 2. Map lucide-react icons to your items
  const navItems = [
    { label: "Dashboard", path: "/", icon: LayoutDashboard },
    { label: "Children", path: "/children", icon: Baby },
    { label: "Staff", path: "/staff", icon: UserCog },
    { label: "Finances", path: "/finance", icon: Wallet },
    { label: "Inventory", path: "/inventory", icon: Package },
    { label: "Accounts Headers", path: "/accounts_headers", icon: BookOpen },
    { label: "Guardians", path: "/guardians", icon: Shield },
  ];

  return (
    // 3. Dynamic width: w-64 expanded, w-20 collapsed
    <aside 
      className={`relative h-full flex flex-col bg-bg border-r border-border transition-all duration-300 z-40 ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      {/* TOGGLE BUTTON: Floats on the right edge */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-8 bg-card border border-border text-text-muted hover:text-text rounded-full p-1 hover:bg-shaded transition-colors z-50 shadow-sm"
      >
        {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      {/* BRAND */}
      <div className={`p-6 border-b border-border flex items-center transition-all ${isCollapsed ? "justify-center" : ""}`}>
        <div className="flex flex-col overflow-hidden whitespace-nowrap">
          {isCollapsed ? (
            <h1 className="text-xl font-black text-primary tracking-tight">OA</h1>
          ) : (
            <>
              <h1 className="text-lg font-black text-text tracking-tight">
                OrphanAdmin
              </h1>
              <p className="text-[10px] text-text-muted uppercase tracking-widest font-black mt-1">
                Management System
              </p>
            </>
          )}
        </div>
      </div>

      {/* NAV */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar overflow-x-hidden">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          const Icon = item.icon;
          return (
            <Link 
              key={item.path} 
              href={item.path} 
              title={isCollapsed ? item.label : undefined} // Shows tooltip when collapsed
            >
              <div 
                className={`flex items-center rounded-xl transition-all duration-200 group ${
                  isCollapsed ? "justify-center p-3" : "px-4 py-3 gap-3"
                } ${
                  isActive 
                    ? "bg-primary text-text-invert shadow-glow" 
                    : "text-text-muted hover:bg-shaded hover:text-text"
                }`}
              >
                <Icon className={`flex-shrink-0 transition-transform group-hover:scale-110 ${isCollapsed ? "w-6 h-6" : "w-5 h-5"}`} />
                
                {/* Text hides gracefully when collapsed */}
                {!isCollapsed && (
                  <span className="text-sm font-bold whitespace-nowrap">
                    {item.label}
                  </span>
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* FOOTER CONTROLS */}
      <div className="p-4 border-t border-border space-y-3">
        
        {/* Theme Toggle adapts layout */}
        <div className={`flex items-center ${isCollapsed ? "justify-center" : "justify-between px-2"}`}>
          {!isCollapsed && (
            <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">
              Theme
            </span>
          )}
          <ThemeToggle />
        </div>

        {/* Logout Button adapts layout */}
        <button
          onClick={() => signOut()}
          title={isCollapsed ? "Logout" : undefined}
          className={`w-full flex items-center text-danger hover:bg-danger/10 rounded-xl transition-all duration-200 group ${
            isCollapsed ? "justify-center p-3" : "px-4 py-3 gap-3"
          }`}
        >
          <LogOut className={`flex-shrink-0 transition-transform group-hover:scale-110 ${isCollapsed ? "w-6 h-6" : "w-5 h-5"}`} />
          
          {!isCollapsed && (
            <span className="text-sm font-bold whitespace-nowrap">
              Logout
            </span>
          )}
        </button>
      </div>
    </aside>
  );
};