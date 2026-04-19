"use client";
import React from "react";
import { ChevronDown, Edit2 } from "lucide-react"; 
import { useUIModals } from "@/hooks/useUIModal";

interface AccountHead {
  _id: string;
  name: string;
  code: string;
  subType?: string[];
  [key: string]: any;
}

interface AccountSectionProps {
  title: string;
  heads: AccountHead[];
  theme: "success" | "danger" | "primary" | "warning";
  isOpen: boolean;
  onToggle: () => void;
  onAdd: () => void;
}

const THEME_STYLES = {
  success: { text: "text-success", bg: "bg-success/10", border: "border-success/30", button: "text-success hover:bg-success hover:text-text-invert border-success/50" },
  danger: { text: "text-danger", bg: "bg-danger/10", border: "border-danger/30", button: "text-danger hover:bg-danger hover:text-text-invert border-danger/50" },
  primary: { text: "text-primary", bg: "bg-primary/10", border: "border-primary/30", button: "text-primary hover:bg-primary hover:text-text-invert border-primary/50" },
  warning: { text: "text-warning", bg: "bg-warning/10", border: "border-warning/30", button: "text-warning hover:bg-warning hover:text-text-invert border-warning/50" },
};

export const AccountSection: React.FC<AccountSectionProps> = ({ 
  title, heads, theme, isOpen, onToggle, onAdd,  
}) => {
  const styles = THEME_STYLES[theme];
  const {openAccountHeadForm}=useUIModals()
  return (
    <div className={`bg-card rounded-2xl border transition-all duration-500 overflow-hidden ${isOpen ? 'border-border shadow-glow' : 'border-border/40 shadow-none hover:border-border'}`}>
      
      {/* ACCORDION HEADER 
          FIX: Changed from <button> to <div role="button"> to prevent invalid nested buttons
      */}
      <div 
        onClick={onToggle}
        role="button"
        tabIndex={0}
        className={`cursor-pointer w-full px-6 py-4 flex justify-between items-center transition-colors select-none ${styles.bg} ${isOpen ? 'border-b ' + styles.border : ''}`}
      >
        <div className="flex items-center gap-4">
          <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${styles.text} ${isOpen ? 'rotate-180' : ''}`} />
          
          <div className="flex items-center gap-3">
            {isOpen && <div className={`w-2 h-2 rounded-full animate-pulse ${styles.bg.replace('/10', '')}`} />}
            <h3 className={`font-black uppercase tracking-[0.2em] text-xs ${styles.text}`}>
              {title} <span className="opacity-50 ml-2">({heads.length})</span>
            </h3>
          </div>
        </div>

        {/* ADD BUTTON (Now safely inside a div, not another button) */}
        <button
          onClick={(e) => {
            e.stopPropagation(); 
            onAdd();
          }}
          className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-lg border transition-all active:scale-95 ${styles.button}`}
        >
          + ADD_HEAD
        </button>
      </div>

      {/* ACCORDION BODY */}
      <div 
        className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
      >
        <div className="overflow-hidden">
          <div className="p-5 flex flex-col gap-3 max-h-[500px] overflow-y-auto custom-scrollbar">
            
            {heads.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center opacity-50 py-8">
                <span className="text-2xl mb-2 grayscale">📂</span>
                <p className="text-[10px] font-mono uppercase tracking-widest text-text-muted">NO_ACTIVE_RECORDS</p>
              </div>
            ) : (
              heads.map((head) => (
                <div key={head._id} className="flex items-center justify-between p-4 bg-shaded/50 border border-border/50 rounded-xl hover:border-border hover:bg-shaded transition-all group">
                  
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-text transition-colors">{head.name}</span>
                    <span className="text-[10px] font-mono text-text-muted mt-1 uppercase tracking-wider">{head.code || "NO_CODE"}</span>
                  </div>

                  <div className="flex items-center gap-4">
                    {head.subType && head.subType.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 justify-end">
                        {head.subType.map((st, idx) => (
                          <span key={idx} className="px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest border border-border/60 rounded bg-bg text-text-muted">
                            {st}
                          </span>
                        ))}
                      </div>
                    )}
                    
                      <button 
                        onClick={() => openAccountHeadForm({initialData:head})} 
                        className="opacity-0 group-hover:opacity-100 p-2 text-text-muted hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                        title="Edit Account Head"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                  </div>

                </div>
              ))
            )}

          </div>
        </div>
      </div>
      
    </div>
  );
};