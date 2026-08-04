'use client';

import { GeistBadge } from '@/shared/ui/geist/GeistBadge';
import { GeistCard } from '@/shared/ui/geist/GeistCard';
import React, { useState } from 'react';

export function RenderingStrategyExperiment() {
  const [selectedStrategy, setSelectedStrategy] = useState<'csr' | 'ssr' | 'ssg' | 'isr'>('isr');

  const strategies = {
    csr: {
      title: '클라이언트 사이드 렌더링',
      ttfb: '1,800 ms',
      fcp: '2,400 ms',
      seo: '불리 (빈 HTML 서빙)',
      serverLoad: '최하 (CDN 정적 자산)',
      description: '브라우저 자바스크립트 실행 후 API 데이터를 호출하여 렌더링합니다.',
      badge: 'rose' as const,
    },
    ssr: {
      title: '서버 사이드 렌더링',
      ttfb: '450 ms',
      fcp: '600 ms',
      seo: '우수 (완성된 HTML 서빙)',
      serverLoad: '높음 (요청마다 서버 렌더링)',
      description: '매 요청마다 Node.js 서버에서 DB 조회 후 HTML을 빌드하여 반환합니다.',
      badge: 'rose' as const,
    },
    ssg: {
      title: '정적 사이트 생성',
      ttfb: '30 ms',
      fcp: '250 ms',
      seo: '최고 (Edge CDN)',
      serverLoad: '없음 (빌드 시 1회 생성)',
      description: '빌드 타임 시점에 정적 HTML을 생성하여 CDN에서 제공합니다.',
      badge: 'blue' as const,
    },
    isr: {
      title: '증분 정적 재생성',
      ttfb: '45 ms',
      fcp: '300 ms',
      seo: '최고 (백그라운드 재검증)',
      serverLoad: '낮음 (주기적 재검증)',
      description: '정적 사이트 생성의 속도를 유지하면서 설정된 주기마다 배경에서 최신화합니다.',
      badge: 'blue' as const,
    },
  };

  const current = strategies[selectedStrategy];

  return (
    <div className="space-y-4">
      {/* Strategy Switcher */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
        {(['csr', 'ssr', 'ssg', 'isr'] as const).map((key) => (
          <button
            type="button"
            key={key}
            onClick={() => setSelectedStrategy(key)}
            className={`p-3.5 rounded-xl border text-left font-mono transition-all ${
              selectedStrategy === key
                ? 'bg-black text-white font-bold border-black shadow-sm'
                : 'bg-white border-neutral-200 text-black hover:bg-neutral-100 font-medium'
            }`}
          >
            <div className="text-sm uppercase font-bold opacity-70 mb-0.5">{key}</div>
            <div className="text-sm font-bold">{strategies[key].title}</div>
          </button>
        ))}
      </div>

      {/* Detail Benchmark */}
      <GeistCard className="bg-white border border-neutral-200">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-neutral-200">
          <h4 className="text-sm font-mono font-bold text-black">{current.title} 벤치마크 지표</h4>
          <GeistBadge variant={current.badge} className="text-sm font-bold">
            전략: {selectedStrategy.toUpperCase()}
          </GeistBadge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4 font-mono text-sm">
          <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
            <div className="text-sm text-neutral-700 mb-0.5 font-bold">초기 응답 속도</div>
            <div className="text-lg font-bold text-blue-900">{current.ttfb}</div>
          </div>
          <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
            <div className="text-sm text-neutral-700 mb-0.5 font-bold">첫 콘텐츠 도출 시간</div>
            <div className="text-lg font-bold text-blue-900">{current.fcp}</div>
          </div>
          <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
            <div className="text-sm text-neutral-700 mb-0.5 font-bold">검색 노출 가능성</div>
            <div className="text-sm font-bold text-black mt-1">{current.seo}</div>
          </div>
          <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
            <div className="text-sm text-neutral-700 mb-0.5 font-bold">서버 CPU 연산 부하</div>
            <div className="text-sm font-bold text-black mt-1">{current.serverLoad}</div>
          </div>
        </div>

        <div className="p-3.5 bg-neutral-50 rounded-lg border border-neutral-200 text-sm text-black font-sans leading-relaxed font-medium">
          💡 {current.description}
        </div>
      </GeistCard>
    </div>
  );
}
