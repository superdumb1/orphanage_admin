"use client";
import { Sun, Moon, Sparkles, Sparkle, Star, StarIcon } from "lucide-react";
import { useState, useEffect } from "react";

export const ThemeToggle = () => {
    // Start as null to avoid hydration mismatch between server and client
    const [theme, setTheme] = useState<"dark" | "light" | null>(null);

    useEffect(() => {
        const stored = localStorage.getItem("theme") as "dark" | "light" | null;
        const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

        const initialTheme = stored || (systemDark ? "dark" : "light");

        setTheme(initialTheme);
        if (initialTheme === "dark") {
            document.documentElement.classList.add("dark");
        }
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        const root = document.documentElement;

        if (newTheme === "dark") {
            root.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            root.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
        setTheme(newTheme);
    };

    // Don't render icons until we know the theme (prevents flickering)
    if (!theme) return <div className="h-[24px] w-[48px] scale-[1.5]" />;

    const isLight = theme === "light";

    const containerClass = `border relative h-[24px] w-[48px] rounded-full transition-colors duration-500 ease-in-out ${isLight ? "bg-white border-gray-100" : "bg-zinc-800 border-zinc-700"
        }`;

    const moonDivClass = `absolute top-0 right-0 w-[24px] h-[24px] p-[2px] transition-all duration-500 ease-in-out ${isLight ? "translate-x-0 scale-0 -rotate-[280deg] opacity-0" : "-translate-x-0 scale-100 rotate-0 opacity-100"
        }`;

    const sunDivClass = `absolute top-0 left-0 w-[24px] h-[24px] p-[2px] transition-all duration-500 ease-in-out ${isLight ? "translate-x-0 scale-100 rotate-0 opacity-100" : "translate-x-[24px] scale-0 -rotate-180 opacity-0"
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
                {

                    theme=="dark" && (
                        <div className="relative">
                            <StarIcon height={4} width={4} fill="#a09f9c" className="absolute top-[0px] left-[20px]" />
                            <StarIcon height={4} width={4} fill="#a09f9c" className="absolute top-[3px] left-[10px]" />
              
                            <Sparkle height={4} width={4} fill="#a09f9c" className="absolute top-[11px] left-[18px]" />
                        </div>
                    )
                }
            </div>
        </button>
    );
};

export default ThemeToggle;