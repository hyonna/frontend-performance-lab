'use client';

import { GeistBadge } from '@/shared/ui/geist/GeistBadge';
import { GeistButton } from '@/shared/ui/geist/GeistButton';
import { GeistCard } from '@/shared/ui/geist/GeistCard';
import React, { useState } from 'react';

export function CssAnimationExperiment() {
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
              렌더링 파이프라인 단계
            </div>
            <div
              className={`text-sm sm:text-base font-bold ${mode === 'before' ? 'text-neutral-600' : 'text-blue-900'}`}
            >
              {mode === 'before' ? 'Layout + Paint + Composite' : 'Composite Only (GPU)'}
            </div>
          </div>
        </div>
      </div>

      {/* 2. 애니메이션 처리 엔진 스펙 */}
      <div className="space-y-3 font-mono text-sm">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
          <span className="text-sm font-bold text-black">애니메이션 처리 엔진 스펙</span>
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
              <span className="text-xs font-bold text-neutral-600 truncate">CPU Main Thread</span>
            </div>
            <div className="text-xs text-neutral-800 space-y-1.5 break-words">
              <div>
                <span className="font-bold text-neutral-900">Reflow:</span> 매 프레임 Reflow 유발
              </div>
              <div>
                <span className="font-bold text-neutral-900">will-change:</span> 미사용
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
              <span className="text-xs font-bold text-blue-900 truncate">GPU Acceleration</span>
            </div>
            <div className="text-xs text-neutral-800 space-y-1.5 break-words">
              <div>
                <span className="font-bold text-neutral-900">Reflow:</span> Reflow 0회 스킵
              </div>
              <div>
                <span className="font-bold text-neutral-900">will-change:</span> transform 힌트 적용
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. 분석 가이드 */}
      <div className="p-3.5 bg-neutral-50 rounded-lg text-sm text-black font-medium leading-relaxed font-sans break-words border-t border-neutral-100 pt-5">
        💡 <span className="font-bold">분석 가이드:</span> top/left 속성 변경은 매 프레임 브라우저의
        Layout과 Paint 단계를 유발합니다. `transform: translate3d()`와 `opacity` 속성을 사용하면
        GPU가 전담하여 메인 스레드 차단 없이 60fps 부드러운 전환을 보장합니다.
      </div>
    </GeistCard>
  );
}
