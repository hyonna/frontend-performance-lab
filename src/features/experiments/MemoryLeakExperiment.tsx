'use client';

import { GeistBadge } from '@/shared/ui/geist/GeistBadge';
import { GeistButton } from '@/shared/ui/geist/GeistButton';
import { GeistCard } from '@/shared/ui/geist/GeistCard';
import React, { useState, useEffect } from 'react';

export function MemoryLeakExperiment() {
  const [mode, setMode] = useState<'before' | 'after'>('after');
  const [mounted, setMounted] = useState(true);
  const [heapSize, setHeapSize] = useState(12.4);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (mounted && mode === 'before') {
      interval = setInterval(() => {
        setHeapSize((prev) => Number((prev + 1.2).toFixed(1)));
      }, 500);
    }
    return () => {
      if (mode === 'after') {
        clearInterval(interval);
      }
    };
  }, [mounted, mode]);

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
              setHeapSize(12.4);
            }}
          >
            개선 전 (Leak 방치)
          </GeistButton>
          <GeistButton
            variant={mode === 'after' ? 'success' : 'outline'}
            size="sm"
            onClick={() => {
              setMode('after');
              setHeapSize(12.4);
            }}
          >
            개선 후 (Cleanup 정돈)
          </GeistButton>
        </div>

        <div className="flex space-x-6 font-mono text-right">
          <div>
            <div className="text-sm text-neutral-700 font-bold">JS Heap 메모리 사용량</div>
            <div
              className={`text-base font-bold ${mode === 'before' ? 'text-neutral-600' : 'text-blue-900'}`}
            >
              {heapSize} MB
            </div>
          </div>
        </div>
      </GeistCard>

      {/* 힙 메모리 시각화 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <GeistCard className="bg-white border border-neutral-200 space-y-3 font-mono">
          <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
            <span className="text-sm font-bold text-black">컴포넌트 라이프사이클 cleanup 조치</span>
            <GeistButton variant="outline" size="sm" onClick={() => setMounted(!mounted)}>
              {mounted ? '컴포넌트 언마운트 시뮬레이션' : '컴포넌트 다시 마운트'}
            </GeistButton>
          </div>

          <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200 text-sm text-black space-y-1 font-medium">
            <div>
              컴포넌트 상태:{' '}
              <span className="font-bold">{mounted ? 'Mount (활성)' : 'Unmount (해제)'}</span>
            </div>
            <div>
              타이머 정리 여부:{' '}
              <span className="font-bold">
                {mode === 'before' ? '미정리 (메모리 누수 발생 중)' : 'clearInterval 정리 완료'}
              </span>
            </div>
          </div>
        </GeistCard>

        <GeistCard className="bg-white border border-neutral-200 space-y-3 font-mono">
          <h4 className="text-sm font-bold text-black border-b border-neutral-200 pb-2">
            가비지 컬렉션(GC) 상태
          </h4>

          <div className="space-y-2 text-sm text-black font-medium">
            <div className="flex justify-between p-2.5 bg-neutral-50 rounded border border-neutral-200">
              <span>Mark-and-Sweep 해제:</span>
              <span
                className={
                  mode === 'before' ? 'text-neutral-600 font-bold' : 'text-blue-900 font-bold'
                }
              >
                {mode === 'before' ? '누수 누적 진행 중' : '정상 해제 완료'}
              </span>
            </div>
          </div>
        </GeistCard>
      </div>
    </div>
  );
}
