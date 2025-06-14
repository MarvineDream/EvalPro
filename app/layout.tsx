"use client";

import './globals.css';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/contexts/AuthContext';
import Sidebar from '@/components/Layout/Sidebar';
import { usePathname } from 'next/navigation';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const hideSidebar = pathname === '/login' || pathname === '/dashboard';

  return (
    <html lang="fr">
      <head>
        <title>EvalPro</title>
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <div className="flex min-h-screen">
            {!hideSidebar && <Sidebar />}
            <main className="flex-1 bg-gray-100 p-6">
              {children}
            </main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
