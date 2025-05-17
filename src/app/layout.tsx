import type { Metadata } from "next";
import {  Geist } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/auth-context";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

// const montserrat = Montserrat({
//   subsets: ["latin"],
//   display:'swap'
// });


export const metadata: Metadata = {
  title: "Escritr",
  description: "Your home for writing",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={geistSans.className}>
        <AuthProvider>
          <div className = "global-container">
            <div className = "whole-content">
              {children}  
            </div>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
