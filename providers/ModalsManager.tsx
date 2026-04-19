"use client";
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { X } from "lucide-react";
import { MODAL_COMPONENTS } from "@/components/modals/Registery";

// 1. Add an ID and an isClosing flag to handle animations per-modal
interface ModalConfig {
    id: string;
    type: string;
    props: any;
    title: string;
    isClosing: boolean; 
}

interface ModalContextType {
    openModal: (type: string, title: string, props?: any) => void;
    closeModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: ReactNode }) {
    // 2. Change state to an Array (Stack)
    const [modals, setModals] = useState<ModalConfig[]>([]);

    const openModal = (type: string, title: string, propsOrEvent: any = {}) => {
        const isEvent = propsOrEvent && (propsOrEvent.nativeEvent || propsOrEvent.preventDefault);
        const cleanProps = isEvent ? {} : propsOrEvent;
        const displayTitle = title || type.replace(/_/g, ' ');

        // Create a unique ID for this specific modal instance
        const newModal: ModalConfig = {
            id: Math.random().toString(36).substring(2, 9),
            type,
            title: displayTitle,
            props: cleanProps,
            isClosing: false
        };

        // Push it to the top of the stack
        setModals((prev) => [...prev, newModal]);
    };

    const closeModal = () => {
        setModals((prev) => {
            if (prev.length === 0) return prev;

            const lastIndex = prev.length - 1;
            const lastModal = prev[lastIndex];

            // Prevent double-clicking issues
            if (lastModal.isClosing) return prev;

            // Mark ONLY the top modal as closing to trigger its exit animation
            const updatedModals = [...prev];
            updatedModals[lastIndex] = { ...lastModal, isClosing: true };

            // Physically remove it from the array after the animation (300ms) finishes
            setTimeout(() => {
                setModals((current) => current.filter((m) => m.id !== lastModal.id));
            }, 300);

            return updatedModals;
        });
    };

    // Close on 'Escape' key (will naturally close the top one first, then the next if pressed again)
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => { if (e.key === "Escape") closeModal(); };
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, []);

    return (
        <ModalContext.Provider value={{ openModal, closeModal }}>
            {children}

            {/* --- THE GLOBAL STACKED MODAL RENDERER --- */}
            {modals.map((modal, index) => {
                const ActiveComponent = MODAL_COMPONENTS[modal.type];
                if (!ActiveComponent) return null;

                return (
                    <div 
                        key={modal.id}
                        // Use inline styles for dynamic z-index so they stack properly!
                        style={{ zIndex: 10000 + index }}
                        className={`fixed inset-0 flex items-center justify-center p-4 md:p-10 transition-all duration-300 ease-in-out ${
                            !modal.isClosing ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                        }`}
                    >
                        {/* BACKDROP */}
                        <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={closeModal} />

                        {/* MODAL CONTAINER */}
                        <div className={`relative w-full max-w-2xl bg-card border border-border rounded-dashboard shadow-glow overflow-hidden transition-all duration-300 ${
                            !modal.isClosing ? "scale-100 translate-y-0" : "scale-95 translate-y-8"
                        }`}>
                            <div className="flex items-center justify-between p-6 border-b border-border/50 bg-shaded/40">
                                <div className="flex flex-col gap-1">
                                    <span className="!text-[15px] font-black text-text-muted uppercase">
                                        {modal.title}
                                    </span>
                                    <span className="text-[9px] font-bold text-primary uppercase tracking-widest opacity-60">
                                        {/* If it's not the top modal, show it on Standby */}
                                        {index === modals.length - 1 ? "Active Session" : "Background Task"}
                                    </span>
                                </div>
                                <button onClick={closeModal} className="w-10 h-10 rounded-2xl bg-bg border border-border flex items-center justify-center text-text-muted hover:text-primary transition-all active:scale-90 shadow-sm">
                                    <X size={20} />
                                </button>
                            </div>

                            {/* DATA TRAY */}
                            <div className="p-8 md:p-10 max-h-[85vh] overflow-y-auto custom-scrollbar bg-card">
                                <ActiveComponent {...modal.props} closeModal={closeModal} />
                            </div>
                        </div>
                    </div>
                );
            })}
        </ModalContext.Provider>
    );
}
export const useModal = () => {
    const context = useContext(ModalContext);
    if (!context) throw new Error("useModal must be used within ModalProvider");
    return context;
};