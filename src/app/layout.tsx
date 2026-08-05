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
  title: 'Frontend Performance Lab — 프론트엔드 성능 최적화 테스트',
  description:
    '의도적으로 느리게 만든 후, 원인을 분석하고 최적화하여 수치로 증명하는 프론트엔드 성능 테스트 플랫폼',
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
  icons: {
    icon: '/icon.svg',
    apple: '/icon.svg',
  },
  openGraph: {
    title: 'Frontend Performance Lab',
    description: '성능 문제 재현 ➔ 원인 분석 ➔ 최적화 적용 ➔ 수치 검증 프론트엔드 최적화 리스트',
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
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="anonymous" />
      </head>
      <body className="bg-geist-bg text-black min-h-screen flex flex-col antialiased">
        <QueryProvider>
          <div className="flex flex-col lg:flex-row min-h-screen">
            <Sidebar />
            <div className="flex-1 flex flex-col min-h-screen w-full overflow-x-hidden">
              <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full">{children}</main>
              {/* 푸터 */}
              <footer className="py-6 px-4 border-t border-neutral-200 text-center text-sm font-sans text-neutral-700 font-medium">
                © 2026 Yoon Hyun A. All rights reserved
              </footer>
            </div>
          </div>
        </QueryProvider>
      </body>
    </html>
  );
}
