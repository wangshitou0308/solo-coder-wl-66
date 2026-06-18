
import type { ReactNode } from 'react';
import Navbar from './Navbar';

export default function PageContainer({ children }: { children: ReactNode }) {
  return (
    <div className="sky-bg min-h-screen relative">
      <div className="relative z-10">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-16">
          {children}
        </main>
      </div>
    </div>
  );
}
