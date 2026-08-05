'use client';

import { GeistBadge } from '@/shared/ui/geist/GeistBadge';
import { GeistButton } from '@/shared/ui/geist/GeistButton';
import { GeistCard } from '@/shared/ui/geist/GeistCard';
import React, { useState } from 'react';

export function ScriptLoadingExperiment() {
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
              초기 렌더링 차단 (FCP)
            </div>
            <div
              className={`text-sm sm:text-base font-bold ${mode === 'before' ? 'text-neutral-600' : 'text-blue-900'}`}
            >
              {mode === 'before' ? '3.2 초 (차단 지연)' : '0.8 초 (초고속)'}
            </div>
          </div>
        </div>
      </div>

      {/* 2. 서드파티 스크립트 로드 스펙 */}
      <div className="space-y-3 font-mono text-sm">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
          <span className="text-sm font-bold text-black">서드파티 스크립트 로드 스펙</span>
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
              <span className="text-xs font-bold text-neutral-600 truncate">Blocking Script</span>
            </div>
            <div className="text-xs text-neutral-800 space-y-1.5 break-words">
              <div>
                <span className="font-bold text-neutral-900">로딩 방식:</span> Head 동기 파싱
              </div>
              <div>
                <span className="font-bold text-neutral-900">스레드 점유:</span> 높음 (수화 지연)
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
              <span className="text-xs font-bold text-blue-900 truncate">lazyOnload</span>
            </div>
            <div className="text-xs text-neutral-800 space-y-1.5 break-words">
              <div>
                <span className="font-bold text-neutral-900">로딩 방식:</span> strategy="lazyOnload"
              </div>
              <div>
                <span className="font-bold text-neutral-900">스레드 점유:</span> 최소화 (핵심 UI
                우선)
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. 분석 가이드 */}
      <div className="p-3.5 bg-neutral-50 rounded-lg text-sm text-black font-medium leading-relaxed font-sans break-words border-t border-neutral-100 pt-5">
        💡 <span className="font-bold">분석 가이드:</span> 외부 챗봇, 애널리틱스, 광고 스크립트가
        상단 동기 태그로 포함되면 메인 스레드가 블로킹되어 FCP가 3초 이상 늦어집니다. Next.js
        Script의 `lazyOnload` 전략을 사용하면 초기 화면 서빙 후 비동기로 불러와 75% 빨라집니다.
      </div>
    </GeistCard>
  );
}
