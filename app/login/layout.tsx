// app/layout.tsx
import '@/app/globals.css';
import { AuthProvider } from '@/contexts/AuthContext';

export const metadata = {
  title: 'EvalPro',
  description: 'Système RH d’évaluation',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
     
      
        <AuthProvider>
          {children} 
        </AuthProvider>
      
    
  );
}
