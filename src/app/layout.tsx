import type { Metadata, Viewport } from 'next';
import './globals.css';
import QueryProvider from '@/shared/providers/QueryProvider';
import { Sidebar } from '@/shared/ui/Sidebar';

export const viewport: Viewport = {
  themeColor: '#ffffff',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'Frontend Performance Lab — 프론트엔드 성능 최적화 실험실',
  description:
    '의도적으로 느리게 만든 후, 원인을 분석하고 최적화하여 수치로 증명하는 프론트엔드 성능 실험 플랫폼',
  keywords: [
    '프론트엔드 성능 최적화',
    'Next.js',
    'React 최적화',
    'Web Vitals',
    'Lighthouse 100',
    'LCP',
    'Virtual Scroll',
    'Code Splitting',
  ],
  openGraph: {
    title: 'Frontend Performance Lab',
    description: '성능 문제 재현 ➔ 원인 분석 ➔ 최적화 적용 ➔ 수치 검증 프론트엔드 최적화 카탈로그',
    type: 'website',
    locale: 'ko_KR',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="anonymous" />
      </head>
      <body className="bg-geist-bg text-black min-h-screen flex flex-col antialiased">
        <QueryProvider>
          <div className="flex flex-1">
            <Sidebar />
            <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full overflow-x-hidden">
              {children}
            </main>
          </div>
        </QueryProvider>
      </body>
    </html>
  );
}
