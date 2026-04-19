"use client";

import React, { useState, useEffect } from "react";
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
  ChevronRight,
  Menu,
  X
} from "lucide-react";

export const Sidebar = () => {
  const pathname = usePathname();
  
  // State for Desktop (Shrink/Expand)
  const [isCollapsed, setIsCollapsed] = useState(false);
  // State for Mobile (Slide In/Out Overlay)
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Close the mobile sidebar automatically when a link is clicked
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

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
    <>
      {/* =========================================
          MOBILE TRIGGER & BACKDROP
          ========================================= */}
      
      {/* Floating Hamburger Button (Visible ONLY on Mobile) */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="md:hidden fixed top-4 left-4 z-40 p-2 bg-card border border-border rounded-xl text-text hover:text-primary shadow-glow transition-all"
      >
        <Menu size={24} />
      </button>

      {/* Deep Blur Backdrop (Visible ONLY on Mobile when open) */}
      {isMobileOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* =========================================
          THE SIDEBAR
          ========================================= */}
      <aside 
        className={`
          /* Base positioning */
          fixed inset-y-0 left-0 z-[60] h-full flex flex-col bg-bg border-r border-border transition-all duration-300 ease-in-out
          
          /* Desktop behavior: Relative positioning (pushes content), dynamic width */
          md:relative md:translate-x-0 md:z-40
          ${isCollapsed ? "md:w-20" : "md:w-64"}

          /* Mobile behavior: Fixed overlay, full 64 width, transforms off-screen when closed */
          w-64
          ${isMobileOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"}
        `}
      >
        {/* DESKTOP TOGGLE BUTTON: Floats on the right edge (Hidden on Mobile) */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden md:block absolute -right-3 top-8 bg-card border border-border text-text-muted hover:text-text rounded-full p-1 hover:bg-shaded transition-colors z-50 shadow-sm"
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>

        {/* MOBILE CLOSE BUTTON (Hidden on Desktop) */}
        <button
          onClick={() => setIsMobileOpen(false)}
          className="md:hidden absolute right-4 top-6 text-text-muted hover:text-danger transition-colors"
        >
          <X size={24} />
        </button>

        {/* BRAND */}
        <div className={`p-6 border-b border-border flex items-center transition-all min-h-[80px] ${isCollapsed ? "md:justify-center" : ""}`}>
          <div className="flex flex-col overflow-hidden whitespace-nowrap">
            {/* On mobile, we ALWAYS show the full logo. On desktop, it depends on isCollapsed */}
            <h1 className={`font-ubuntu font-black tracking-tight ${isCollapsed ? "md:text-xl text-lg md:text-primary text-text" : "text-lg text-text"}`}>
              {/* If desktop is collapsed, show 'OA', otherwise show full name */}
              <span className="hidden md:inline">{isCollapsed ? "OA" : "OrphanAdmin"}</span>
              <span className="md:hidden">OrphanAdmin</span>
            </h1>
            
            <p className={`font-ubuntu text-[10px] text-text-muted uppercase tracking-widest font-black mt-1 ${isCollapsed ? "md:hidden" : ""}`}>
              Management System
            </p>
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
                title={isCollapsed ? item.label : undefined}
              >
                <div 
                  className={`flex items-center rounded-xl transition-all duration-200 group ${
                    isCollapsed ? "md:justify-center px-4 py-3 md:p-3 gap-3" : "px-4 py-3 gap-3"
                  } ${
                    isActive 
                      ? "bg-primary text-white shadow-glow" // Explicitly white here so icons pop on the blue background
                      : "text-text-muted hover:bg-shaded hover:text-text"
                  }`}
                >
                  <Icon className={`flex-shrink-0 transition-transform group-hover:scale-110 ${isCollapsed ? "md:w-6 md:h-6 w-5 h-5" : "w-5 h-5"}`} />
                  
                  {/* Text hides gracefully when collapsed ON DESKTOP, but always shows on mobile */}
                  <span className={`font-ubuntu text-sm font-bold whitespace-nowrap ${isCollapsed ? "md:hidden" : ""}`}>
                    {item.label}
                  </span>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* FOOTER CONTROLS */}
        <div className="p-4 border-t border-border space-y-3">
          
          <div className={`flex items-center ${isCollapsed ? "md:justify-center justify-between px-2" : "justify-between px-2"}`}>
            <span className={`font-ubuntu text-[10px] font-black uppercase tracking-widest text-text-muted ${isCollapsed ? "md:hidden" : ""}`}>
              Theme
            </span>
            <ThemeToggle />
          </div>

          <button
            onClick={() => signOut()}
            title={isCollapsed ? "Logout" : undefined}
            className={`w-full flex items-center text-danger hover:bg-danger/10 rounded-xl transition-all duration-200 group ${
              isCollapsed ? "md:justify-center px-4 py-3 md:p-3 gap-3" : "px-4 py-3 gap-3"
            }`}
          >
            <LogOut className={`flex-shrink-0 transition-transform group-hover:scale-110 ${isCollapsed ? "md:w-6 md:h-6 w-5 h-5" : "w-5 h-5"}`} />
            
            <span className={`font-ubuntu text-sm font-bold whitespace-nowrap ${isCollapsed ? "md:hidden" : ""}`}>
              Logout
            </span>
          </button>
        </div>
      </aside>
    </>
  );
};