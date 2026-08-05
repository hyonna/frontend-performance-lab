'use client';

import { GeistBadge } from '@/shared/ui/geist/GeistBadge';
import { GeistButton } from '@/shared/ui/geist/GeistButton';
import { GeistCard } from '@/shared/ui/geist/GeistCard';
import React, { useState } from 'react';

export function ContextSplittingExperiment() {
  const [mode, setMode] = useState<'before' | 'after'>('after');
  const [renderCount, setRenderCount] = useState(0);

  const handleStateChange = () => {
    setRenderCount((prev) => prev + (mode === 'before' ? 180 : 2));
  };

  return (
    <GeistCard className="bg-white border border-neutral-200 p-5 space-y-6 font-sans">
      {/* 1. 상단 모드 스위처 및 수치 지표 (통합 카드 내부) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-neutral-100">
        <div className="flex flex-wrap items-center gap-2">
          <GeistButton
            variant={mode === 'before' ? 'danger' : 'outline'}
            size="sm"
            onClick={() => {
              setMode('before');
              setRenderCount(0);
            }}
          >
            개선 전 모드
          </GeistButton>
          <GeistButton
            variant={mode === 'after' ? 'success' : 'outline'}
            size="sm"
            onClick={() => {
              setMode('after');
              setRenderCount(0);
            }}
          >
            개선 후 모드
          </GeistButton>
        </div>

        <div className="flex items-center space-x-4 font-mono sm:text-right shrink-0">
          <div>
            <div className="text-xs sm:text-sm text-neutral-700 font-bold">
              누적 발생 렌더링 노드 수
            </div>
            <div
              className={`text-sm sm:text-base font-bold ${mode === 'before' ? 'text-neutral-600' : 'text-blue-900'}`}
            >
              {renderCount} 개 노드
            </div>
          </div>
          <GeistButton variant="primary" size="sm" onClick={handleStateChange}>
            프로필 정보 변경
          </GeistButton>
        </div>
      </div>

      {/* 2. Context 아키텍처 스펙 */}
      <div className="space-y-3 font-mono text-sm">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
          <span className="text-sm font-bold text-black">Context 아키텍처 스펙</span>
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
              <span className="text-xs font-bold text-neutral-600 truncate">Single Context</span>
            </div>
            <div className="text-xs text-neutral-800 space-y-1.5 break-words">
              <div>
                <span className="font-bold text-neutral-900">구독 범위:</span> 전체 180개 노드 동시
                렌더링
              </div>
              <div>
                <span className="font-bold text-neutral-900">상태 분리:</span> 미분리 (단일 value)
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
              <span className="text-xs font-bold text-blue-900 truncate">Split Context</span>
            </div>
            <div className="text-xs text-neutral-800 space-y-1.5 break-words">
              <div>
                <span className="font-bold text-neutral-900">구독 범위:</span> 연관 2개 노드 선택
                렌더링
              </div>
              <div>
                <span className="font-bold text-neutral-900">상태 분리:</span> 전용 Context 물리
                분리
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. 가이드 */}
      <div className="p-3.5 bg-neutral-50 rounded-lg text-sm text-black font-medium leading-relaxed font-sans break-words border-t border-neutral-100 pt-5">
        💡 <span className="font-bold">분석 가이드:</span> 단일 Context에 상태와 핸들러를 묶어서
        전달하면, 상태 일부만 변경되어도 useContext를 사용하는 하위 모든 컴포넌트가 강제
        재렌더링됩니다.
      </div>
    </GeistCard>
  );
}
