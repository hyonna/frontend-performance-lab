'use client';

import { GeistBadge } from '@/shared/ui/geist/GeistBadge';
import { GeistButton } from '@/shared/ui/geist/GeistButton';
import { GeistCard } from '@/shared/ui/geist/GeistCard';
import React, { useState } from 'react';

export function SkeletonExperiment() {
  const [mode, setMode] = useState<'before' | 'after'>('after');
  const [loading, setLoading] = useState(false);

  const simulateLoading = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1200);
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
              setLoading(false);
            }}
          >
            개선 전 모드
          </GeistButton>
          <GeistButton
            variant={mode === 'after' ? 'success' : 'outline'}
            size="sm"
            onClick={() => {
              setMode('after');
              setLoading(false);
            }}
          >
            개선 후 모드
          </GeistButton>
        </div>

        <div className="flex items-center space-x-4 font-mono sm:text-right shrink-0">
          <div>
            <div className="text-xs sm:text-sm text-neutral-700 font-bold">
              누적 레이아웃 시프트 (CLS)
            </div>
            <div
              className={`text-sm sm:text-base font-bold ${mode === 'before' ? 'text-neutral-600' : 'text-blue-900'}`}
            >
              {mode === 'before' ? '0.38 (위험)' : '0.00 (완벽)'}
            </div>
          </div>
          <GeistButton variant="primary" size="sm" onClick={simulateLoading} disabled={loading}>
            {loading ? '로딩 중...' : '데이터 수신 실행'}
          </GeistButton>
        </div>
      </div>

      {/* 2. 미리보기 뷰포트 */}
      <div className="space-y-3 font-mono">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
          <span className="text-sm font-bold text-black">
            {mode === 'before' ? 'Spinner 렌더링 뷰' : 'Skeleton UI 렌더링 뷰'}
          </span>
          <GeistBadge variant={mode === 'before' ? 'rose' : 'blue'} className="text-xs font-bold">
            {mode === 'before' ? '공간 미확보' : '공간 사전 예약'}
          </GeistBadge>
        </div>

        {loading ? (
          mode === 'before' ? (
            <div className="h-40 flex items-center justify-center font-mono text-sm text-neutral-700 font-bold bg-neutral-50 rounded-lg">
              🌀 데이터 로딩 중 (공간 0px)...
            </div>
          ) : (
            <div className="space-y-3 p-4 bg-neutral-50 rounded-lg animate-pulse">
              <div className="h-4 bg-neutral-300 rounded w-3/4" />
              <div className="h-4 bg-neutral-200 rounded w-1/2" />
              <div className="h-20 bg-neutral-200 rounded w-full" />
            </div>
          )
        ) : (
          <div className="space-y-3 p-4 bg-neutral-50 rounded-lg font-mono text-sm">
            <div className="text-sm font-bold text-black">
              📦 프론트엔드 최적화 리포트 수신 완료
            </div>
            <p className="text-neutral-700 text-sm leading-relaxed font-sans font-medium">
              Skeleton UI를 적용하면 비동기 데이터가 도착했을 때 레이아웃 덜커덕거림(Layout Shift)이
              발생하지 않습니다.
            </p>
          </div>
        )}
      </div>

      {/* 3. Web Vitals CLS 분석 */}
      <div className="space-y-3 font-mono border-t border-neutral-100 pt-5">
        <h4 className="text-sm font-bold text-black">Web Vitals CLS 분석</h4>

        <div className="space-y-2 text-sm text-black font-medium">
          <div className="flex justify-between p-3 bg-neutral-50 rounded-lg">
            <span>CLS 측정 지표:</span>
            <span
              className={
                mode === 'before' ? 'text-neutral-600 font-bold' : 'text-blue-900 font-bold'
              }
            >
              {mode === 'before' ? '0.38 (레이아웃 이동 발생)' : '0.00 (레이아웃 이동 없음)'}
            </span>
          </div>
          <div className="flex justify-between p-3 bg-neutral-50 rounded-lg">
            <span>체감 대기 시간 (Perceived):</span>
            <span className="font-bold">
              {mode === 'before' ? '긴 체감 지연' : '즉각 반응 체감'}
            </span>
          </div>
        </div>
      </div>

      {/* 4. 최적화 가이드 */}
      <div className="p-3.5 bg-neutral-50 rounded-lg text-sm text-black font-medium leading-relaxed font-sans break-words border-t border-neutral-100 pt-5">
        💡 <span className="font-bold">가이드:</span> 데이터 로딩 위치에 Skeleton 틀을 사전에
        렌더링해 두면 레이아웃 밀림이 전면 방지됩니다.
      </div>
    </GeistCard>
  );
}
