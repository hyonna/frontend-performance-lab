'use client';

import { GeistBadge } from '@/shared/ui/geist/GeistBadge';
import { GeistButton } from '@/shared/ui/geist/GeistButton';
import { GeistCard } from '@/shared/ui/geist/GeistCard';
import React, { useState, memo, useCallback } from 'react';

function SlowItem({ id, text }: { id: number; text: string }) {
  const startTime = performance.now();
  while (performance.now() - startTime < 1.2) {}

  return (
    <div className="p-3 bg-neutral-100 border border-neutral-300 rounded-lg flex justify-between items-center font-mono text-sm">
      <div>
        <span className="text-neutral-600 font-bold">아이템 #{id}</span>
        <div className="text-black font-sans text-sm mt-0.5 font-medium">{text}</div>
      </div>
      <span className="px-2 py-0.5 bg-neutral-200 text-neutral-700 text-sm rounded font-bold">
        재렌더링 됨
      </span>
    </div>
  );
}

const FastItem = memo(function FastItem({ id, text }: { id: number; text: string }) {
  return (
    <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-lg flex justify-between items-center font-mono text-sm">
      <div>
        <span className="text-blue-900 font-bold">아이템 #{id}</span>
        <div className="text-black font-sans text-sm mt-0.5 font-medium">{text}</div>
      </div>
      <span className="px-2 py-0.5 bg-blue-50 text-blue-900 text-sm rounded font-bold">
        렌더링 스킵
      </span>
    </div>
  );
});

export function RenderingExperiment() {
  const [mode, setMode] = useState<'before' | 'after'>('before');
  const [parentCount, setParentCount] = useState(0);
  const [renderStats, setRenderStats] = useState({ totalRenders: 0 });

  const items = Array.from({ length: 40 }, (_, i) => ({
    id: i + 1,
    text: `성능 테스트 데이터 노드 ${i + 1}`,
  }));

  const handleParentUpdate = useCallback(() => {
    setParentCount((prev) => prev + 1);

    setTimeout(() => {
      setRenderStats((prev) => ({
        totalRenders: mode === 'before' ? prev.totalRenders + 40 : prev.totalRenders + 1,
      }));
    }, 10);
  }, [mode]);

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

        <div className="flex items-center space-x-4 font-mono">
          <div className="text-right">
            <div className="text-sm text-neutral-700 font-bold">누적 하위 렌더 횟수</div>
            <div
              className={`text-base font-bold ${mode === 'before' ? 'text-neutral-600' : 'text-blue-900'}`}
            >
              {renderStats.totalRenders} 회
            </div>
          </div>
          <GeistButton variant="primary" size="sm" onClick={handleParentUpdate}>
            <span>상태 변경 (카운트: {parentCount})</span>
          </GeistButton>
        </div>
      </GeistCard>

      {/* Demo Grid */}
      <GeistCard className="bg-white border border-neutral-200">
        <div className="flex items-center justify-between mb-3 pb-3 border-b border-neutral-200 text-sm font-mono">
          <div className="text-black font-bold">
            {mode === 'before' ? '40개 전체 컴포넌트 렌더링' : '상태 격리 렌더링 스킵'}
          </div>
          <GeistBadge variant={mode === 'before' ? 'rose' : 'blue'} className="text-sm font-bold">
            {mode === 'before' ? '40개 노드 전체 재렌더링' : '39개 노드 렌더링 스킵'}
          </GeistBadge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2.5 max-h-[340px] overflow-y-auto pr-1">
          {items.map((item) =>
            mode === 'before' ? (
              <SlowItem key={item.id} id={item.id} text={item.text} />
            ) : (
              <FastItem key={item.id} id={item.id} text={item.text} />
            ),
          )}
        </div>
      </GeistCard>
    </div>
  );
}
