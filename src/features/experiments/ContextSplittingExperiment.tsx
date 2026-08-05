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
    <div className="space-y-4 font-sans">
      <GeistCard className="flex items-center justify-between p-4 bg-white border border-neutral-200">
        <div className="flex space-x-2">
          <GeistButton
            variant={mode === 'before' ? 'danger' : 'outline'}
            size="sm"
            onClick={() => {
              setMode('before');
              setRenderCount(0);
            }}
          >
            개선 전 (단일 거대 Context)
          </GeistButton>
          <GeistButton
            variant={mode === 'after' ? 'success' : 'outline'}
            size="sm"
            onClick={() => {
              setMode('after');
              setRenderCount(0);
            }}
          >
            개선 후 (Context 분리 & Selector)
          </GeistButton>
        </div>

        <div className="flex items-center space-x-4 font-mono">
          <div className="text-right">
            <div className="text-sm text-neutral-700 font-bold">누적 발생 렌더링 노드 수</div>
            <div
              className={`text-base font-bold ${mode === 'before' ? 'text-neutral-600' : 'text-blue-900'}`}
            >
              {renderCount} 개 노드
            </div>
          </div>
          <GeistButton variant="primary" size="sm" onClick={handleStateChange}>
            프로필 정보 변경
          </GeistButton>
        </div>
      </GeistCard>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <GeistCard className="bg-white border border-neutral-200 space-y-3 font-mono">
          <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
            <span className="text-sm font-bold text-black">Context 아키텍처 스펙</span>
            <GeistBadge variant={mode === 'before' ? 'rose' : 'blue'} className="text-sm font-bold">
              {mode === 'before' ? 'Single Huge Context' : 'Split User/Dispatch Context'}
            </GeistBadge>
          </div>

          <div className="space-y-2 text-sm text-black font-medium">
            <div className="flex justify-between p-2.5 bg-neutral-50 rounded border border-neutral-200">
              <span>구독 자식 컴포넌트 영향:</span>
              <span
                className={
                  mode === 'before' ? 'text-neutral-600 font-bold' : 'text-blue-900 font-bold'
                }
              >
                {mode === 'before'
                  ? '전체 180개 노드 동시 재렌더링'
                  : '연관 2개 노드만 선택 렌더링'}
              </span>
            </div>
            <div className="flex justify-between p-2.5 bg-neutral-50 rounded border border-neutral-200">
              <span>상태 - 디스패치 분리:</span>
              <span className="font-bold">
                {mode === 'before' ? '미분리 (동일 value 전달)' : '물리적 전용 Context 분리 완료'}
              </span>
            </div>
          </div>
        </GeistCard>

        <GeistCard className="bg-white border border-neutral-200 space-y-3 font-mono">
          <h4 className="text-sm font-bold text-black border-b border-neutral-200 pb-2">
            렌더링 영향도 리포트
          </h4>

          <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200 text-sm text-black font-medium leading-relaxed">
            💡 <span className="font-bold">분석 가이드:</span> 단일 Context에 상태와 핸들러를 묶어서
            전달하면, 상태 일부만 변경되어도 useContext를 사용하는 하위 모든 컴포넌트가 강제
            재렌더링됩니다.
          </div>
        </GeistCard>
      </div>
    </div>
  );
}
