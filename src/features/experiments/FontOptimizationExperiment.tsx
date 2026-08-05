'use client';

import { GeistBadge } from '@/shared/ui/geist/GeistBadge';
import { GeistButton } from '@/shared/ui/geist/GeistButton';
import { GeistCard } from '@/shared/ui/geist/GeistCard';
import React, { useState } from 'react';

export function FontOptimizationExperiment() {
  const [mode, setMode] = useState<'before' | 'after'>('after');

  return (
    <GeistCard className="bg-white border border-neutral-200 p-5 space-y-6 font-sans">
      {/* 1. 상단 모드 스위처 및 수치 지표 (통합 카드 내부) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-neutral-100">
        <div className="flex flex-wrap items-center gap-2">
          <GeistButton
            variant={mode === 'before' ? 'danger' : 'outline'}
            size="sm"
            onClick={() => setMode('before')}
          >
            개선 전 모드
          </GeistButton>
          <GeistButton
            variant={mode === 'after' ? 'success' : 'outline'}
            size="sm"
            onClick={() => setMode('after')}
          >
            개선 후 모드
          </GeistButton>
        </div>

        <div className="flex items-center space-x-4 font-mono sm:text-right shrink-0">
          <div>
            <div className="text-xs sm:text-sm text-neutral-700 font-bold">
              폰트 레이아웃 이동 (CLS)
            </div>
            <div
              className={`text-sm sm:text-base font-bold ${mode === 'before' ? 'text-neutral-600' : 'text-blue-900'}`}
            >
              {mode === 'before' ? '0.19 (시프트 발생)' : '0.00 (이동 제로)'}
            </div>
          </div>
        </div>
      </div>

      {/* 2. 웹폰트 로딩 전략 스펙 */}
      <div className="space-y-3 font-mono text-sm">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
          <span className="text-sm font-bold text-black">웹폰트 로딩 전략 스펙</span>
          <GeistBadge variant="mono" className="text-xs font-bold">
            Before & After
          </GeistBadge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div
            className={`p-3 rounded-lg space-y-2 min-w-0 transition ${
              mode === 'before' ? 'bg-red-50/80 ring-2 ring-red-400/30' : 'bg-neutral-50 opacity-80'
            }`}
          >
            <div className="flex items-center justify-between border-b border-neutral-200/50 pb-1.5">
              <GeistBadge variant="rose" className="text-xs font-bold">
                개선 전
              </GeistBadge>
              <span className="text-xs font-bold text-neutral-600 truncate">Unoptimized TTF</span>
            </div>
            <div className="text-xs text-neutral-800 space-y-1.5 break-words">
              <div>
                <span className="font-bold text-neutral-900">font-display:</span> 미지정 (FOIT 발생)
              </div>
              <div>
                <span className="font-bold text-neutral-900">폰트 용량:</span> 3.2 MB (원본 TTF)
              </div>
            </div>
          </div>

          <div
            className={`p-3 rounded-lg space-y-2 min-w-0 transition ${
              mode === 'after'
                ? 'bg-blue-50/80 ring-2 ring-blue-400/30'
                : 'bg-neutral-50 opacity-80'
            }`}
          >
            <div className="flex items-center justify-between border-b border-neutral-200/50 pb-1.5">
              <GeistBadge variant="blue" className="text-xs font-bold">
                개선 후
              </GeistBadge>
              <span className="text-xs font-bold text-blue-900 truncate">Preloaded WOFF2</span>
            </div>
            <div className="text-xs text-neutral-800 space-y-1.5 break-words">
              <div>
                <span className="font-bold text-neutral-900">font-display:</span> swap 선확보
              </div>
              <div>
                <span className="font-bold text-neutral-900">폰트 용량:</span> 98 KB (WOFF2 Subset)
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. 분석 가이드 */}
      <div className="p-3.5 bg-neutral-50 rounded-lg text-sm text-black font-medium leading-relaxed font-sans break-words border-t border-neutral-100 pt-5">
        💡 <span className="font-bold">분석 가이드:</span> 웹폰트 로딩 속도가 늦으면 초기 렌더링된
        텍스트의 줄바꿈과 줄높이가 갑자기 바뀌면서 CLS 점수가 나빠집니다. WOFF2 경량화와 preload,
        font-display: swap을 적용하면 CLS 0점을 유지할 수 있습니다.
      </div>
    </GeistCard>
  );
}
