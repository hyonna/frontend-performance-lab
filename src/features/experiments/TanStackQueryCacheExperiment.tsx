'use client';

import { GeistBadge } from '@/shared/ui/geist/GeistBadge';
import { GeistButton } from '@/shared/ui/geist/GeistButton';
import { GeistCard } from '@/shared/ui/geist/GeistCard';
import React, { useState } from 'react';

export function TanStackQueryCacheExperiment() {
  const [mode, setMode] = useState<'before' | 'after'>('after');
  const [apiCalls, setApiCalls] = useState(1);

  const simulatePageTransition = () => {
    if (mode === 'before') {
      setApiCalls((prev) => prev + 1);
    }
  };

  return (
    <div className="space-y-4 font-sans">
      <GeistCard className="flex items-center justify-between p-4 bg-white border border-neutral-200">
        <div className="flex space-x-2">
          <GeistButton
            variant={mode === 'before' ? 'danger' : 'outline'}
            size="sm"
            onClick={() => {
              setMode('before');
              setApiCalls(1);
            }}
          >
            개선 전 (staleTime: 0ms)
          </GeistButton>
          <GeistButton
            variant={mode === 'after' ? 'success' : 'outline'}
            size="sm"
            onClick={() => {
              setMode('after');
              setApiCalls(1);
            }}
          >
            개선 후 (staleTime: 5min & Prefetch)
          </GeistButton>
        </div>

        <div className="flex items-center space-x-4 font-mono">
          <div className="text-right">
            <div className="text-sm text-neutral-700 font-bold">API 재요청 횟수</div>
            <div
              className={`text-base font-bold ${mode === 'before' ? 'text-neutral-600' : 'text-blue-900'}`}
            >
              {apiCalls} 회
            </div>
          </div>
          <GeistButton variant="primary" size="sm" onClick={simulatePageTransition}>
            페이지 재방문 시뮬레이션
          </GeistButton>
        </div>
      </GeistCard>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-sm">
        <GeistCard className="bg-white border border-neutral-200 space-y-3">
          <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
            <span className="text-sm font-bold text-black">TanStack Query 캐싱 설정</span>
            <GeistBadge variant={mode === 'before' ? 'rose' : 'blue'} className="text-sm font-bold">
              {mode === 'before' ? 'staleTime: 0' : 'staleTime: 5분'}
            </GeistBadge>
          </div>

          <div className="space-y-2 text-sm text-black font-medium">
            <div className="flex justify-between p-2.5 bg-neutral-50 rounded border border-neutral-200">
              <span>인메모리 gcTime (구 cacheTime):</span>
              <span className="font-bold">
                {mode === 'before' ? '즉시 소멸' : '30분 인메모리 유지'}
              </span>
            </div>
            <div className="flex justify-between p-2.5 bg-neutral-50 rounded border border-neutral-200">
              <span>호버 사전 로딩 (Prefetch):</span>
              <span className="font-bold">
                {mode === 'before' ? '미적용' : 'prefetchQuery 적용'}
              </span>
            </div>
          </div>
        </GeistCard>

        <GeistCard className="bg-white border border-neutral-200 space-y-3">
          <h4 className="text-sm font-bold text-black border-b border-neutral-200 pb-2">
            체감 속도 분석
          </h4>

          <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200 text-sm text-black font-medium leading-relaxed font-sans">
            💡 <span className="font-bold">분석 가이드:</span> `staleTime`이 0일 경우 페이지 재진입
            시마다 동일한 API를 재요청하여 스피너가 반복 노출됩니다. 5분 이상의 적절한 staleTime과
            prefetch를 조합하면 0ms 속도를 체감할 수 있습니다.
          </div>
        </GeistCard>
      </div>
    </div>
  );
}
