"use client";
import React from 'react';
import { signOut } from 'next-auth/react';
import Link from 'next/link';

export const Sidebar = () => {
  const navItems = [
    { label: 'Dashboard', path: '/' },
    { label: 'Children', path: '/children' },
    { label: 'Staff', path: '/staff' }, 
    { label: 'Finances', path: '/finance' },
    { label: 'Inventory', path: '/inventory' },
    { label: 'Accounts Headas', path: '/inventory' },//oncome expenses 
    { label: 'Guardians', path: '/guardians' }
    

  ];

  return (
    <aside className="w-64 bg-zinc-900 text-zinc-100 h-full flex flex-col shrink-0">
      <div className="p-5 text-xl font-bold border-b border-zinc-800 text-red-500">
        OrphanAdmin
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map(item => (
          <Link href={item.path} key={item.label}>
            <button className="w-full text-left px-4 py-2 rounded hover:bg-zinc-800 transition">
              {item.label}
            </button>
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-zinc-800">
        <button
          onClick={() => signOut()}
          className="w-full text-left px-4 py-2 text-rose-400 hover:bg-zinc-800 rounded transition"
        >
          Logout
        </button>
      </div>
    </aside>
  );
};