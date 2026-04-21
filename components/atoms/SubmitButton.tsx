"use client";

import { useFormStatus } from "react-dom";
import { Loader2, ShieldCheck } from "lucide-react";

export const SubmitButton = ({ children, className, variant = "primary", ...props }: any) => {
    const { pending } = useFormStatus();

    return (
        <button
            type="submit"
            {...props}
            disabled={pending || props.disabled}
            className={`
        relative overflow-hidden transition-all duration-300 active:scale-95
        disabled:cursor-not-allowed flex items-center justify-center gap-3
        ${variant === "primary" ? "btn-primary shadow-glow" : "btn-ghost"}
        ${className}
      `}
        >
            {pending ? (
                <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="uppercase tracking-[0.2em] text-[9px] font-black">
                        Executing Protocol...
                    </span>
                </>
            ) : (
                <>{children}</>
            )}

            {/* Visual indicator of "Processing" */}
            {pending && (
                <div className="absolute inset-0 bg-primary/10 animate-pulse" />
            )}
        </button>
    );
};