'use client';

import { GeistBadge } from '@/shared/ui/geist/GeistBadge';
import { GeistButton } from '@/shared/ui/geist/GeistButton';
import { GeistCard } from '@/shared/ui/geist/GeistCard';
import React, { useState } from 'react';

export function ApiParallelExperiment() {
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
            개선 전 (Sequential Waterfall)
          </GeistButton>
          <GeistButton
            variant={mode === 'after' ? 'success' : 'outline'}
            size="sm"
            onClick={() => setMode('after')}
          >
            개선 후 (Promise.all 병렬 패칭)
          </GeistButton>
        </div>

        <div className="flex space-x-6 font-mono text-right">
          <div>
            <div className="text-sm text-neutral-700 font-bold">총 API 대기 소요시간</div>
            <div
              className={`text-base font-bold ${mode === 'before' ? 'text-neutral-600' : 'text-blue-900'}`}
            >
              {mode === 'before' ? '1,850 ms (직열 지연)' : '420 ms (병렬 최적)'}
            </div>
          </div>
        </div>
      </GeistCard>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-sm">
        <GeistCard className="bg-white border border-neutral-200 space-y-3">
          <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
            <span className="text-sm font-bold text-black">네트워크 아키텍처 방식</span>
            <GeistBadge variant={mode === 'before' ? 'rose' : 'blue'} className="text-sm font-bold">
              {mode === 'before' ? 'Serial await' : 'Promise.all / useQueries'}
            </GeistBadge>
          </div>

          <div className="space-y-2 text-sm text-black font-medium">
            <div className="flex justify-between p-2.5 bg-neutral-50 rounded border border-neutral-200">
              <span>호출 파이프라인:</span>
              <span className="font-bold">
                {mode === 'before'
                  ? 'API 1 ➔ API 2 ➔ API 3 순차 순선'
                  : 'API 1, 2, 3 동시 병렬 발사'}
              </span>
            </div>
            <div className="flex justify-between p-2.5 bg-neutral-50 rounded border border-neutral-200">
              <span>네트워크 워터폴 지연:</span>
              <span className="font-bold">
                {mode === 'before'
                  ? '각 API 시간 합산 (1,850ms)'
                  : '가장 긴 API 시간 단 1회 (420ms)'}
              </span>
            </div>
          </div>
        </GeistCard>

        <GeistCard className="bg-white border border-neutral-200 space-y-3">
          <h4 className="text-sm font-bold text-black border-b border-neutral-200 pb-2">
            네트워크 병렬화 분석
          </h4>

          <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200 text-sm text-black font-medium leading-relaxed font-sans">
            💡 <span className="font-bold">분석 가이드:</span> 상호 의존성이 없는 API들을 순차적으로
            `await` 호출하면 워터폴(Waterfall) 지연이 발생합니다. `Promise.all`이나 TanStack Query의
            `useQueries`로 병렬 처리하면 가장 긴 요청 시간 하나만 소요되어 응답 속도가 70% 이상
            빨라집니다.
          </div>
        </GeistCard>
      </div>
    </div>
  );
}
