"use client";
import React from 'react';
import { Button } from "@/components/atoms/Button";

const AddAccountsHeader = ({ onAddClick }: { onAddClick?: () => void }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-zinc-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      
      {/* Title & Icon Section */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center text-2xl border border-emerald-100 shadow-sm">
          🏦
        </div>
        <div>
          <h1 className="text-2xl font-black text-zinc-900 tracking-tight">Financial Accounts</h1>
          <p className="text-sm text-zinc-500 font-medium">Manage orphanage bank accounts, cash registers, and digital wallets (eSewa/Khalti).</p>
        </div>
      </div>

      {/* Action Button */}
      <Button 
        onClick={onAddClick} 
        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-5 rounded-lg shadow-sm whitespace-nowrap transition-colors"
      >
        + Add New Account
      </Button>

    </div>
  );
}

export default AddAccountsHeader;