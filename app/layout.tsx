import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/providers/AppProvider";
import { AppShell } from "@/components/organisms/AppShell";

const geistSans = Geist({ 
  variable: "--font-geist-sans", 
  subsets: ["latin"],
  display: 'swap',
});

const geistMono = Geist_Mono({ 
  variable: "--font-geist-mono", 
  subsets: ["latin"],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "OrphanAdmin | Kree Corp",
  description: "Internal management and financial audit system for Kree Corp Orphanage.",
  icons: {
    icon: "/favicon.ico", // Ensure you have a themed favicon!
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html 
      lang="en" 
      // suppressHydrationWarning is essential for theme-switching apps
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="
        min-h-full flex flex-col 
        /* Theme Foundation */
        bg-bg text-text 
        /* Smooth cross-fade when switching themes */
        transition-colors duration-500 
        selection:bg-primary/30 selection:text-primary
      ">
        <AppProvider>
          {/* AppShell handles the Sidebar, Topbar, and Main Content Area */}
          <AppShell>
            {children}
          </AppShell>
        </AppProvider>
      </body>
    </html>
  );
}