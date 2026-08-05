'use client';

import { GeistBadge } from '@/shared/ui/geist/GeistBadge';
import { GeistButton } from '@/shared/ui/geist/GeistButton';
import { GeistCard } from '@/shared/ui/geist/GeistCard';
import React, { useState } from 'react';

export function SuspenseStreamingExperiment() {
  const [mode, setMode] = useState<'before' | 'after'>('after');

  return (
    <div className="space-y-4 font-sans">
      <GeistCard className="flex items-center justify-between p-4 bg-white border border-neutral-200">
        <div className="flex space-x-2">
          <GeistButton
            variant={mode === 'before' ? 'danger' : 'outline'}
            size="sm"
            onClick={() => setMode('before')}
          >
            개선 전 (전체 API 대기 SSR)
          </GeistButton>
          <GeistButton
            variant={mode === 'after' ? 'success' : 'outline'}
            size="sm"
            onClick={() => setMode('after')}
          >
            개선 후 (Suspense & Streaming SSR)
          </GeistButton>
        </div>

        <div className="flex space-x-6 font-mono text-right">
          <div>
            <div className="text-sm text-neutral-700 font-bold">첫 화면 TTFB (백화면 대기)</div>
            <div
              className={`text-base font-bold ${mode === 'before' ? 'text-neutral-600' : 'text-blue-900'}`}
            >
              {mode === 'before' ? '2,400 ms (전체 대기)' : '120 ms (즉시 렌더링)'}
            </div>
          </div>
        </div>
      </GeistCard>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-sm">
        <GeistCard className="bg-white border border-neutral-200 space-y-3">
          <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
            <span className="text-sm font-bold text-black">서버 HTML 스트리밍 아키텍처</span>
            <GeistBadge variant={mode === 'before' ? 'rose' : 'blue'} className="text-sm font-bold">
              {mode === 'before' ? 'Blocking All-or-Nothing' : 'Streaming HTML Chunk'}
            </GeistBadge>
          </div>

          <div className="space-y-2 text-sm text-black font-medium">
            <div className="flex justify-between p-2.5 bg-neutral-50 rounded border border-neutral-200">
              <span>상단 화면 서빙 시점:</span>
              <span className="font-bold">
                {mode === 'before'
                  ? '모든 API (느린 2.4초 API) 포함 완료 후'
                  : '120ms 만에 헤더/메인 셸 즉시 서빙'}
              </span>
            </div>
            <div className="flex justify-between p-2.5 bg-neutral-50 rounded border border-neutral-200">
              <span>Suspense 스켈레톤 주입:</span>
              <span className="font-bold">
                {mode === 'before'
                  ? '미적용 (긴 백화면 발생)'
                  : '느린 부위만 Suspense 경계로 스트리밍'}
              </span>
            </div>
          </div>
        </GeistCard>

        <GeistCard className="bg-white border border-neutral-200 space-y-3">
          <h4 className="text-sm font-bold text-black border-b border-neutral-200 pb-2">
            TTFB 및 체감 반응 분석
          </h4>

          <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200 text-sm text-black font-medium leading-relaxed font-sans">
            💡 <span className="font-bold">분석 가이드:</span> 기존 SSR은 가장 느린 API 응답이 끝날
            때까지 유저에게 전체 빈 백화면을 보여줍니다. React Suspense와 Streaming SSR을 활용하면
            빠른 상단 영역을 120ms 만에 즉시 서빙하고 느린 영역만 HTML 스트림으로 덧붙여 체감 속도를
            극대화합니다.
          </div>
        </GeistCard>
      </div>
    </div>
  );
}
