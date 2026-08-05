'use client';

import { GeistBadge } from '@/shared/ui/geist/GeistBadge';
import { GeistButton } from '@/shared/ui/geist/GeistButton';
import { GeistCard } from '@/shared/ui/geist/GeistCard';
import React, { useState } from 'react';

export function SkeletonExperiment() {
  const [mode, setMode] = useState<'before' | 'after'>('after');
  const [loading, setLoading] = useState(false);
  const [clsScore, setClsScore] = useState<number>(0.0);

  const simulateLoading = () => {
    setLoading(true);
    setClsScore(mode === 'before' ? 0.38 : 0.0);
    setTimeout(() => {
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="space-y-4">
      {/* 모드 스위처 */}
      <GeistCard className="flex items-center justify-between p-4 bg-white border border-neutral-200">
        <div className="flex space-x-2">
          <GeistButton
            variant={mode === 'before' ? 'danger' : 'outline'}
            size="sm"
            onClick={() => {
              setMode('before');
              setLoading(false);
            }}
          >
            개선 전 (Spinner)
          </GeistButton>
          <GeistButton
            variant={mode === 'after' ? 'success' : 'outline'}
            size="sm"
            onClick={() => {
              setMode('after');
              setLoading(false);
            }}
          >
            개선 후 (Skeleton UI)
          </GeistButton>
        </div>

        <div className="flex items-center space-x-4 font-mono">
          <div className="text-right">
            <div className="text-sm text-neutral-700 font-bold">누적 레이아웃 시프트 (CLS)</div>
            <div
              className={`text-base font-bold ${mode === 'before' ? 'text-neutral-600' : 'text-blue-900'}`}
            >
              {mode === 'before' ? '0.38 (위험)' : '0.00 (완벽)'}
            </div>
          </div>
          <GeistButton variant="primary" size="sm" onClick={simulateLoading} disabled={loading}>
            {loading ? '로딩 중...' : '데이터 수신 실행'}
          </GeistButton>
        </div>
      </GeistCard>

      {/* 미리보기 뷰포트 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <GeistCard className="bg-white border border-neutral-200 space-y-3 min-h-[260px] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-neutral-200">
              <span className="text-sm font-mono font-bold text-black">
                {mode === 'before' ? 'Spinner 렌더링 뷰' : 'Skeleton UI 렌더링 뷰'}
              </span>
              <GeistBadge
                variant={mode === 'before' ? 'rose' : 'blue'}
                className="text-sm font-bold"
              >
                {mode === 'before' ? '공간 미확보' : '공간 사전 예약'}
              </GeistBadge>
            </div>

            {loading ? (
              mode === 'before' ? (
                <div className="h-40 flex items-center justify-center font-mono text-sm text-neutral-700 font-bold">
                  🌀 데이터 로딩 중 (공간 0px)...
                </div>
              ) : (
                <div className="space-y-3 p-3 bg-neutral-50 rounded-lg border border-neutral-200 animate-pulse">
                  <div className="h-4 bg-neutral-300 rounded w-3/4" />
                  <div className="h-4 bg-neutral-200 rounded w-1/2" />
                  <div className="h-20 bg-neutral-200 rounded w-full" />
                </div>
              )
            ) : (
              <div className="space-y-3 p-3 bg-neutral-50 rounded-lg border border-neutral-200 font-mono text-sm">
                <div className="text-sm font-bold text-black">
                  📦 프론트엔드 최적화 리포트 수신 완료
                </div>
                <p className="text-neutral-700 text-sm leading-relaxed font-sans font-medium">
                  Skeleton UI를 적용하면 비동기 데이터가 도착했을 때 레이아웃 덜커덕거림(Layout
                  Shift)이 발생하지 않습니다.
                </p>
              </div>
            )}
          </div>
        </GeistCard>

        <GeistCard className="bg-white border border-neutral-200 space-y-3 font-mono flex flex-col justify-between">
          <div>
            <h4 className="text-sm font-bold text-black mb-3">Web Vitals CLS 분석</h4>

            <div className="space-y-2 text-sm text-black font-medium">
              <div className="flex justify-between p-2.5 bg-neutral-50 rounded border border-neutral-200">
                <span>CLS 측정 지표:</span>
                <span
                  className={
                    mode === 'before' ? 'text-neutral-600 font-bold' : 'text-blue-900 font-bold'
                  }
                >
                  {mode === 'before' ? '0.38 (레이아웃 이동 발생)' : '0.00 (레이아웃 이동 없음)'}
                </span>
              </div>
              <div className="flex justify-between p-2.5 bg-neutral-50 rounded border border-neutral-200">
                <span>체감 대기 시간 (Perceived):</span>
                <span className="font-bold">
                  {mode === 'before' ? '긴 체감 지연' : '즉각 반응 체감'}
                </span>
              </div>
            </div>
          </div>

          <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200 text-sm text-black font-medium">
            💡 <span className="font-bold">가이드:</span> 데이터 로딩 위치에 Skeleton 틀을 사전에
            렌더링해 두면 레이아웃 밀림이 전면 방지됩니다.
          </div>
        </GeistCard>
      </div>
    </div>
  );
}
