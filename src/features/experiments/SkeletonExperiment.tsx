'use client';

import { GeistButton } from '@/shared/ui/geist/GeistButton';
import { GeistCard } from '@/shared/ui/geist/GeistCard';
import React, { useState } from 'react';

export function SkeletonExperiment() {
  const [mode, setMode] = useState<'before' | 'after'>('after');
  const [loading, setLoading] = useState(false);

  const simulateLoad = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="space-y-4">
      {/* Mode Switcher */}
      <GeistCard className="flex items-center justify-between p-4 bg-white border border-neutral-200">
        <div className="flex space-x-2">
          <GeistButton
            variant={mode === 'before' ? 'danger' : 'outline'}
            size="sm"
            onClick={() => {
              setMode('before');
              simulateLoad();
            }}
          >
            개선 전 모드
          </GeistButton>
          <GeistButton
            variant={mode === 'after' ? 'success' : 'outline'}
            size="sm"
            onClick={() => {
              setMode('after');
              simulateLoad();
            }}
          >
            개선 후 모드
          </GeistButton>
        </div>

        <div className="flex items-center space-x-4 font-mono">
          <div className="text-right">
            <div className="text-sm text-neutral-700 font-bold">누적 레이아웃 밀림 지표</div>
            <div
              className={`text-base font-bold ${mode === 'before' ? 'text-neutral-600' : 'text-blue-900'}`}
            >
              {mode === 'before' ? '0.28 (불량)' : '0.00 (완벽)'}
            </div>
          </div>
          <GeistButton variant="outline" size="sm" onClick={simulateLoad}>
            재로딩 시뮬레이션
          </GeistButton>
        </div>
      </GeistCard>

      {/* Demo Viewport */}
      <GeistCard className="bg-white border border-neutral-200">
        <h4 className="text-sm font-mono font-bold text-black mb-3">
          레이아웃 밀림 시프트 미리보기 뷰포트
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono">
          {loading ? (
            mode === 'before' ? (
              <div className="p-3 bg-neutral-100 rounded border border-neutral-300 text-sm text-black font-medium">
                데이터 로딩 중...
              </div>
            ) : (
              <div className="p-3 bg-neutral-50 rounded border border-neutral-200 space-y-2 animate-pulse">
                <div className="w-full h-32 bg-neutral-200 rounded" />
                <div className="w-3/4 h-4 bg-neutral-200 rounded" />
                <div className="w-1/2 h-4 bg-neutral-200 rounded" />
              </div>
            )
          ) : (
            <div className="p-3 bg-neutral-50 rounded border border-neutral-200 space-y-2">
              <div className="w-full h-32 bg-black text-white font-bold flex items-center justify-center text-sm rounded">
                상품 이미지 영역
              </div>
              <h5 className="font-bold text-black text-sm">최적화된 성능 검증 키트</h5>
              <p className="text-sm text-neutral-700 font-medium">Lighthouse CLS 0점 달성 카드</p>
            </div>
          )}

          <div className="p-3.5 bg-neutral-50 rounded border border-neutral-200 text-sm text-neutral-700 font-sans flex items-center font-medium leading-relaxed">
            📌 이 위치는 하단 콘텐츠입니다. 개선 전 모드에서는 상단 카드가 뒤늦게 그려지면서 아래로
            200px 밀려 내려갑니다.
          </div>
        </div>
      </GeistCard>
    </div>
  );
}
