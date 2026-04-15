"use client";
import { Sun, Moon, Sparkle, StarIcon } from "lucide-react";
import { useState, useEffect } from "react";

export const ThemeToggle = () => {
    const [theme, setTheme] = useState<"dark" | "light" | null>(null);

    useEffect(() => {
        const stored = localStorage.getItem("theme") as "dark" | "light" | null;
        const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

        const initialTheme = stored || (systemDark ? "dark" : "light");

        setTheme(initialTheme);
        
        // 🚨 FIX: If it's light mode, add the .light class
        if (initialTheme === "light") {
            document.documentElement.classList.add("light");
        } else {
            document.documentElement.classList.remove("light");
        }
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        const root = document.documentElement;

        // 🚨 FIX: Add/Remove .light instead of .dark
        if (newTheme === "light") {
            root.classList.add("light");
            localStorage.setItem("theme", "light");
        } else {
            root.classList.remove("light");
            localStorage.setItem("theme", "dark");
        }
        setTheme(newTheme);
    };

    if (!theme) return <div className="h-[24px] w-[48px] scale-[1.5]" />;

    const isLight = theme === "light";

    // 🚨 STYLING FIX: Use your CSS variables here too!
    // Instead of bg-white, use bg-bg or bg-card
    const containerClass = `border relative h-[24px] w-[48px] rounded-full transition-colors duration-500 ease-in-out ${
        isLight ? "bg-bg border-border" : "bg-zinc-800 border-zinc-700"
    }`;

    const moonDivClass = `absolute top-0 right-0 w-[24px] h-[24px] p-[2px] transition-all duration-500 ease-in-out ${
        isLight ? "translate-x-0 scale-0 -rotate-[280deg] opacity-0" : "-translate-x-0 scale-100 rotate-0 opacity-100"
    }`;

    const sunDivClass = `absolute top-0 left-0 w-[24px] h-[24px] p-[2px] transition-all duration-500 ease-in-out ${
        isLight ? "translate-x-0 scale-100 rotate-0 opacity-100" : "translate-x-[24px] scale-0 -rotate-180 opacity-0"
    }`;

    return (
        <button onClick={toggleTheme} className="flex items-center gap-2 overflow-hidden scale-[1.5] transition-transform active:scale-[1.4]">
            <div className={containerClass}>
                <div className={sunDivClass}>
                    <Sun width={"18px"} height={"18px"} color="#fff050" fill="#fff050" />
                </div>
                <div className={moonDivClass}>
                    <Moon width={"18px"} height={"18px"} color="#a09f9c" fill="#a09f9c" />
                </div>
                {theme === "dark" && (
                    <div className="relative pointer-events-none">
                        <StarIcon height={4} width={4} fill="#a09f9c" className="absolute top-[0px] left-[20px] animate-pulse" />
                        <StarIcon height={4} width={4} fill="#a09f9c" className="absolute top-[3px] left-[10px] animate-bounce" />
                        <Sparkle height={4} width={4} fill="#a09f9c" className="absolute top-[11px] left-[18px] animate-pulse" />
                    </div>
                )}
            </div>
        </button>
    );
};

export default ThemeToggle;