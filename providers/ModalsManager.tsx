"use client";
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { X } from "lucide-react";
import { MODAL_COMPONENTS } from "@/components/modals/Registery";

interface ModalState {
    type: string | null;
    props: any;
}

interface ModalContextType {
    openModal: (type: string, props?: any) => void;
    closeModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: ReactNode }) {
    const [view, setView] = useState<ModalState>({ type: null, props: {} });
    const [isVisible, setIsVisible] = useState(false);

    // Trigger to open with specific ID and Data
    const openModal = (type: string, props: any = {}) => {
        setView({ type, props });
        setIsVisible(true);
    };

    const closeModal = () => {
        setIsVisible(false);
        // Clear data after animation finishes (300ms)
        setTimeout(() => setView({ type: null, props: {} }), 300);
    };

    // Close on 'Escape' key for premium UX
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => { if (e.key === "Escape") closeModal(); };
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, []);

    const ActiveComponent = view.type ? MODAL_COMPONENTS[view.type] : null;

    return (
        <ModalContext.Provider value={{ openModal, closeModal }}>
            {children}

            {/* --- THE GLOBAL MODAL RENDERER --- */}
            {view.type && (
                <div className={`fixed inset-0 z-[10000] flex items-center justify-center p-4 md:p-10 transition-all duration-300 ease-in-out ${
                    isVisible ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                }`}>
                    
                    {/* BACKDROP: Deep blur to isolate the dossier */}
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={closeModal} />

                    {/* MODAL CONTAINER: OrphanAdmin Aesthetic */}
                    <div className={`relative w-full max-w-2xl bg-card border border-border rounded-dashboard shadow-glow overflow-hidden transition-all duration-300 ${
                        isVisible ? "scale-100 translate-y-0" : "scale-95 translate-y-8"
                    }`}>
                        
                        {/* ADMINISTRATIVE HEADER */}
                        <div className="flex items-center justify-between p-6 border-b border-border/50 bg-shaded/40">
                            <div className="flex flex-col gap-1">
                                <span className="text-[10px] font-black text-text-muted uppercase tracking-[0.3em]">
                                    System Directive // {view.type.replace('_', ' ')}
                                </span>
                                <span className="text-[9px] font-bold text-primary uppercase tracking-widest opacity-60">
                                    Secure Entry Protocol Active
                                </span>
                            </div>
                            <button 
                                onClick={closeModal}
                                className="w-10 h-10 rounded-2xl bg-bg border border-border flex items-center justify-center text-text-muted hover:text-primary transition-all active:scale-90 shadow-sm"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* DATA TRAY */}
                        <div className="p-8 md:p-10 max-h-[85vh] overflow-y-auto custom-scrollbar bg-card">
                            {ActiveComponent ? (
                                <ActiveComponent {...view.props} closeModal={closeModal} />
                            ) : (
                                <div className="p-20 text-center font-black text-danger uppercase text-xs tracking-[0.5em]">
                                    Registry Fault: Component Not Found
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </ModalContext.Provider>
    );
}

export const useModal = () => {
    const context = useContext(ModalContext);
    if (!context) throw new Error("useModal must be used within ModalProvider");
    return context;
};