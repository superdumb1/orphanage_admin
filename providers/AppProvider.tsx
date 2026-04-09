"use client";
import { createContext } from "react";
import { SessionProvider } from "next-auth/react";

const AppContext = createContext<any>(null)


export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <AppContext.Provider value={{}}>
            <SessionProvider>
                {children}
            </SessionProvider>
        </AppContext.Provider>
    )
}

