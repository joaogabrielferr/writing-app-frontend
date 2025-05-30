import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/auth-context";
import { SidebarProvider } from "@/context/sidebar-context";
import { Bokor, Roboto } from "next/font/google";

const roboto = Roboto({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const bokor = Bokor({
  weight:"400",
  subsets:["latin"]
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
  description: "Your home for writing"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={roboto.className}>
        <AuthProvider>
          <SidebarProvider>
            <div className = "global-container">
              <div className = "whole-content">
                {children}  
              </div>
            </div>
          </SidebarProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
