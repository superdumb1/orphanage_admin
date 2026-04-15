"use client";
import { createContext } from "react";
import { SessionProvider } from "next-auth/react";
import { ModalProvider } from "./ModalsManager";

const AppContext = createContext<any>(null)


export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <AppContext.Provider value={{}}>
            <ModalProvider>
                <SessionProvider>
                    {children}
                </SessionProvider>
            </ModalProvider>
        </AppContext.Provider>
    )
}

