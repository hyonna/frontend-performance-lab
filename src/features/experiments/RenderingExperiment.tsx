'use client';

import { GeistBadge } from '@/shared/ui/geist/GeistBadge';
import { GeistButton } from '@/shared/ui/geist/GeistButton';
import { GeistCard } from '@/shared/ui/geist/GeistCard';
import React, { useState, memo } from 'react';

function SlowItem({ id, text }: { id: number; text: string }) {
  const startTime = performance.now();
  while (performance.now() - startTime < 1) {}

  return (
    <div className="p-2.5 rounded bg-neutral-100/70 text-xs font-mono flex items-center justify-between">
      <span className="text-black font-medium">
        #{id} {text}
      </span>
      <span className="text-neutral-700 font-bold">렌더 됨</span>
    </div>
  );
}

const FastItem = memo(function FastItem({ id, text }: { id: number; text: string }) {
  return (
    <div className="p-2.5 rounded bg-neutral-50 text-xs font-mono flex items-center justify-between">
      <span className="text-black font-medium">
        #{id} {text}
      </span>
      <span className="text-blue-900 font-bold">스킵 됨</span>
    </div>
  );
});

export function RenderingExperiment() {
  const [mode, setMode] = useState<'before' | 'after'>('after');
  const [parentCount, setParentCount] = useState(0);
  const [renderStats, setRenderStats] = useState({ totalRenders: 0 });

  const items = Array.from({ length: 40 }, (_, i) => ({
    id: i + 1,
    text: `컴포넌트 ${i + 1}`,
  }));

  const handleParentUpdate = () => {
    setParentCount((prev) => prev + 1);
    if (mode === 'before') {
      setRenderStats((prev) => ({ totalRenders: prev.totalRenders + 40 }));
    } else {
      setRenderStats((prev) => ({ totalRenders: prev.totalRenders + 1 }));
    }
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
              setRenderStats({ totalRenders: 0 });
            }}
          >
            개선 전 모드
          </GeistButton>
          <GeistButton
            variant={mode === 'after' ? 'success' : 'outline'}
            size="sm"
            onClick={() => {
              setMode('after');
              setRenderStats({ totalRenders: 0 });
            }}
          >
            개선 후 모드
          </GeistButton>
        </div>

        <div className="flex items-center space-x-4 font-mono sm:text-right shrink-0">
          <div>
            <div className="text-xs sm:text-sm text-neutral-700 font-bold">누적 하위 렌더 횟수</div>
            <div
              className={`text-sm sm:text-base font-bold ${mode === 'before' ? 'text-neutral-600' : 'text-blue-900'}`}
            >
              {renderStats.totalRenders} 회
            </div>
          </div>
          <GeistButton variant="primary" size="sm" onClick={handleParentUpdate}>
            <span>상태 변경 (카운트: {parentCount})</span>
          </GeistButton>
        </div>
      </div>

      {/* 2. 본문 데모 영역 */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-3 text-sm font-mono">
          <div className="text-black font-bold">
            {mode === 'before' ? '40개 전체 컴포넌트 렌더링' : '상태 격리 렌더링 스킵'}
          </div>
          <GeistBadge variant={mode === 'before' ? 'rose' : 'blue'} className="text-xs font-bold">
            {mode === 'before' ? '40개 노드 전체 재렌더링' : '39개 노드 렌더링 스킵'}
          </GeistBadge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 max-h-[340px] overflow-y-auto pr-1">
          {items.map((item) =>
            mode === 'before' ? (
              <SlowItem key={item.id} id={item.id} text={item.text} />
            ) : (
              <FastItem key={item.id} id={item.id} text={item.text} />
            ),
          )}
        </div>
      </div>
    </GeistCard>
  );
}
