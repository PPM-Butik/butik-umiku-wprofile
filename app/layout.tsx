import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from '@/components/providers/providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Butik Umiku Ethica Store Banjaratma - Fashion Muslim Modern',
  description: 'Butik fashion muslimah modern dengan koleksi terkini. Temukan busana muslim berkualitas tinggi untuk wanita modern.',
  keywords: 'butik, fashion muslim, baju muslim, hijab, gamis, tunik, busana muslim, Banjaratma',
  icons: {
    icon: '/icon-butik.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
