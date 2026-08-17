import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { GlobalRobotAssistant } from '@/components/ui/global-robot-assistant';

export const metadata: Metadata = {
  title: 'Club Idea Hub — Student Innovation & Credit Engine',
  description: 'Gamified student club application platform with Skill League, Skill-Barter, Coding Challenges, and AI Credit Agent.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased selection:bg-blue-500 selection:text-white">
        <AuthProvider>
          {children}
          <GlobalRobotAssistant />
        </AuthProvider>
      </body>
    </html>
  );
}
