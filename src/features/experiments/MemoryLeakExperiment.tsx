'use client';

import { GeistBadge } from '@/shared/ui/geist/GeistBadge';
import { GeistButton } from '@/shared/ui/geist/GeistButton';
import { GeistCard } from '@/shared/ui/geist/GeistCard';
import React, { useState } from 'react';

export function MemoryLeakExperiment() {
  const [mode, setMode] = useState<'before' | 'after'>('after');
  const [memoryHeap, setMemoryHeap] = useState(14);
  const [activeTimers, setActiveTimers] = useState(0);

  const triggerLeak = () => {
    if (mode === 'before') {
      setActiveTimers((prev) => prev + 1);
      setMemoryHeap((prev) => prev + 34);
    } else {
      setMemoryHeap(14);
      setActiveTimers(0);
    }
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
              setMemoryHeap(14);
              setActiveTimers(0);
            }}
          >
            개선 전 모드
          </GeistButton>
          <GeistButton
            variant={mode === 'after' ? 'success' : 'outline'}
            size="sm"
            onClick={() => {
              setMode('after');
              setMemoryHeap(14);
              setActiveTimers(0);
            }}
          >
            개선 후 모드
          </GeistButton>
        </div>

        <GeistButton variant="primary" size="sm" onClick={triggerLeak}>
          <span>페이지 진입/이탈 반복</span>
        </GeistButton>
      </GeistCard>

      {/* Heap Visualizer */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <GeistCard className="bg-white border border-neutral-200">
          <h4 className="text-sm font-mono font-bold text-black mb-3">
            자바스크립트 힙 스냅샷 메모리
          </h4>

          <div className="space-y-3 font-mono">
            <div className="p-3 bg-neutral-50 rounded border border-neutral-200">
              <div className="text-sm text-neutral-700 mb-0.5 font-bold">누적 유지 메모리</div>
              <div
                className={`text-2xl font-black ${memoryHeap > 80 ? 'text-neutral-600' : 'text-blue-900'}`}
              >
                {memoryHeap} MB
              </div>
            </div>

            <div className="w-full h-3.5 bg-neutral-100 rounded-full overflow-hidden border border-neutral-200">
              <div
                style={{ width: `${Math.min(100, (memoryHeap / 200) * 100)}%` }}
                className={`h-full transition-all duration-300 ${memoryHeap > 80 ? 'bg-neutral-400' : 'bg-blue-900'}`}
              />
            </div>
          </div>
        </GeistCard>

        <GeistCard className="bg-white border border-neutral-200 flex flex-col justify-between">
          <div>
            <h4 className="text-sm font-mono font-bold text-black mb-3">가비지 컬렉터 회수 상태</h4>

            <div className="p-3 bg-neutral-50 rounded border border-neutral-200 space-y-2 font-mono text-sm text-black font-medium">
              <div>
                미해제 타이머 수: <span className="text-black font-bold">{activeTimers} 개</span>
              </div>
              <div className="flex items-center space-x-2 pt-1">
                <span>메모리 회수 상태:</span>
                <GeistBadge
                  variant={memoryHeap > 80 ? 'rose' : 'blue'}
                  className="text-sm font-bold"
                >
                  {memoryHeap > 80 ? '메모리 누수 경고' : '정상 회수 완료'}
                </GeistBadge>
              </div>
            </div>
          </div>
        </GeistCard>
      </div>
    </div>
  );
}
