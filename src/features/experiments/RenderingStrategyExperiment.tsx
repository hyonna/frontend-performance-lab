'use client';

import { GeistBadge } from '@/shared/ui/geist/GeistBadge';
import { GeistButton } from '@/shared/ui/geist/GeistButton';
import { GeistCard } from '@/shared/ui/geist/GeistCard';
import React, { useState } from 'react';

type Strategy = 'csr' | 'ssr' | 'ssg' | 'isr';

export function RenderingStrategyExperiment() {
  const [strategy, setStrategy] = useState<Strategy>('isr');

  const strategyData = {
    csr: {
      title: 'CSR (Client-Side Rendering)',
      ttfb: '150 ms',
      fcp: '1,800 ms',
      seo: '낮음 (빈 HTML 서빙)',
      serverLoad: '매우 낮음',
      desc: '클라이언트 브라우저가 자바스크립트를 다운로드한 후 DOM을 조립합니다.',
    },
    ssr: {
      title: 'SSR (Server-Side Rendering)',
      ttfb: '420 ms',
      fcp: '520 ms',
      seo: '매우 높음 (완성된 HTML)',
      serverLoad: '높음 (매 요청마다 서버 계산)',
      desc: '매 요청 시점마다 서버에서 DB 쿼리 후 최신 HTML을 즉시 생성하여 서빙합니다.',
    },
    ssg: {
      title: 'SSG (Static Site Generation)',
      ttfb: '25 ms',
      fcp: '180 ms',
      seo: '최상 (CDN 캐싱)',
      serverLoad: '0 (빌드 타임 1회 생성)',
      desc: '빌드 시점에 HTML을 정적으로 pre-render하여 Edge CDN에서 0ms 수준으로 즉시 서빙합니다.',
    },
    isr: {
      title: 'ISR (Incremental Static Regeneration)',
      ttfb: '30 ms',
      fcp: '210 ms',
      seo: '최상 (백그라운드 갱신)',
      serverLoad: '매우 낮음 (정해진 주기마다 백그라운드 갱신)',
      desc: 'SSG의 초고속 속도를 유지하면서, 백그라운드 재검증(Revalidation)을 통해 데이터를 지속 업데이트합니다.',
    },
  };

  const current = strategyData[strategy];

  return (
    <div className="space-y-4">
      {/* 렌더링 전략 스위처 */}
      <GeistCard className="flex items-center justify-between p-4 bg-white border border-neutral-200">
        <div className="flex space-x-2">
          {(['csr', 'ssr', 'ssg', 'isr'] as Strategy[]).map((s) => (
            <GeistButton
              key={s}
              variant={strategy === s ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setStrategy(s)}
            >
              {s.toUpperCase()}
            </GeistButton>
          ))}
        </div>

        <GeistBadge variant="mono" className="text-sm font-bold">
          선택된 전략: {strategy.toUpperCase()}
        </GeistBadge>
      </GeistCard>

      {/* 상세 벤치마크 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <GeistCard className="bg-white border border-neutral-200 space-y-3 font-mono">
          <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
            <h4 className="text-sm font-bold text-black">{current.title}</h4>
            <GeistBadge variant="default" className="text-sm font-bold">
              전략 스펙
            </GeistBadge>
          </div>

          <p className="text-sm text-neutral-700 font-sans leading-relaxed font-medium">
            {current.desc}
          </p>

          <div className="space-y-2 pt-2 text-sm text-black font-medium">
            <div className="flex justify-between p-2.5 bg-neutral-50 rounded border border-neutral-200">
              <span>TTFB (첫 바이트 수신 시간):</span>
              <span className="font-bold">{current.ttfb}</span>
            </div>
            <div className="flex justify-between p-2.5 bg-neutral-50 rounded border border-neutral-200">
              <span>FCP (화면 첫 렌더링 시간):</span>
              <span className="font-bold">{current.fcp}</span>
            </div>
          </div>
        </GeistCard>

        <GeistCard className="bg-white border border-neutral-200 space-y-3 font-mono">
          <h4 className="text-sm font-bold text-black border-b border-neutral-200 pb-2">
            인프라 영향도 분석
          </h4>

          <div className="space-y-2 text-sm text-black font-medium">
            <div className="flex justify-between p-2.5 bg-neutral-50 rounded border border-neutral-200">
              <span>검색엔진 최적화 (SEO):</span>
              <span className="font-bold">{current.seo}</span>
            </div>
            <div className="flex justify-between p-2.5 bg-neutral-50 rounded border border-neutral-200">
              <span>오리진 서버 연산 부하:</span>
              <span className="font-bold">{current.serverLoad}</span>
            </div>
          </div>
        </GeistCard>
      </div>
    </div>
  );
}
