'use client';

import { GeistBadge } from '@/shared/ui/geist/GeistBadge';
import { GeistButton } from '@/shared/ui/geist/GeistButton';
import { GeistCard } from '@/shared/ui/geist/GeistCard';
import React, { useState } from 'react';

export function AccessibilityExperiment() {
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
              라이트하우스 접근성 점수
            </div>
            <div
              className={`text-sm sm:text-base font-bold ${mode === 'before' ? 'text-neutral-600' : 'text-blue-900'}`}
            >
              {mode === 'before' ? '54 점' : '100 점'}
            </div>
          </div>
        </div>
      </div>

      {/* 2. 접근성 마크업 데모 */}
      <div className="space-y-3 font-mono">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
          <span className="text-sm font-bold text-black">접근성 마크업 데모</span>
          <GeistBadge variant={mode === 'before' ? 'rose' : 'blue'} className="text-xs font-bold">
            {mode === 'before' ? '비시맨틱 HTML' : 'WAI-ARIA 준수'}
          </GeistBadge>
        </div>

        {mode === 'before' ? (
          <div className="p-4 bg-neutral-100 rounded-lg space-y-2 text-xs sm:text-sm text-neutral-700">
            <div className="font-bold text-black">
              &lt;div onClick=&#123;...&#125;&gt;클릭버튼&lt;/div&gt;
            </div>
            <p className="text-xs sm:text-sm font-sans font-medium">
              ⚠️ 키보드 Tab 포커스가 불가능하며 스크린 리더가 버튼으로 인식하지 못합니다.
            </p>
          </div>
        ) : (
          <div className="p-4 bg-blue-50/70 rounded-lg space-y-2 text-xs sm:text-sm text-blue-900">
            <div className="font-bold text-black">
              &lt;button type="button" aria-label="성능 데이터 리포트 제출"&gt;...&lt;/button&gt;
            </div>
            <p className="text-xs sm:text-sm font-sans font-medium">
              ✅ 키보드 엔터/스페이스 탐색 완벽 지원 및 스크린 리더 음성 안내를 지원합니다.
            </p>
          </div>
        )}
      </div>

      {/* 3. Lighthouse 점검 항목 */}
      <div className="space-y-3 font-mono border-t border-neutral-100 pt-5">
        <h4 className="text-sm font-bold text-black">Lighthouse 100점 점검 항목</h4>

        <div className="space-y-2 text-sm text-black font-medium">
          <div className="flex justify-between p-3 bg-neutral-50 rounded-lg">
            <span>키보드 Tab 내비게이션:</span>
            <span className="font-bold">{mode === 'before' ? '불가' : '완벽 지원'}</span>
          </div>
          <div className="flex justify-between p-3 bg-neutral-50 rounded-lg">
            <span>스크린 리더 음성 전달:</span>
            <span className="font-bold">{mode === 'before' ? '누락' : '정상 보장'}</span>
          </div>
        </div>
      </div>
    </GeistCard>
  );
}
