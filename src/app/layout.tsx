import type { Metadata } from 'next';
import '@/shared/styles/globals.css';

export const metadata: Metadata = {
  title: 'SudakGuide2',
  description: 'MVP booking service'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body className="bg-slate-50 text-slate-900">{children}</body>
    </html>
  );
}
