import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "発電所管理システム - Next.js + Supabase",
  description: "Next.jsとSupabaseを使用した発電所データ管理システム",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${inter.variable} font-sans antialiased`}>
        <div className="flex">
          <Sidebar />
          <main className="flex-1 ml-64 min-h-screen bg-gray-50">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
