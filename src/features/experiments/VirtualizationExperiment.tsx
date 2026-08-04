'use client';

import { GeistBadge } from '@/shared/ui/geist/GeistBadge';
import { GeistButton } from '@/shared/ui/geist/GeistButton';
import { GeistCard } from '@/shared/ui/geist/GeistCard';
import { useVirtualizer } from '@tanstack/react-virtual';
import React, { useState, useRef } from 'react';

export function VirtualizationExperiment() {
  const [mode, setMode] = useState<'before' | 'after'>('after');
  const parentRef = useRef<HTMLDivElement>(null);

  const items = Array.from({ length: 100000 }, (_, i) => ({
    id: i + 1,
    name: `쇼핑몰 상품 노드 아이템 #${i + 1}`,
    price: `${(Math.floor(Math.random() * 900) + 100).toLocaleString()} 원`,
  }));

  const rowVirtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 48,
    overscan: 5,
  });

  return (
    <div className="space-y-4">
      {/* Mode Switcher & Stats */}
      <GeistCard className="flex items-center justify-between p-4 bg-white border border-neutral-200">
        <div className="flex space-x-2">
          <GeistButton
            variant={mode === 'before' ? 'danger' : 'outline'}
            size="sm"
            onClick={() => setMode('before')}
          >
            개선 전 (10만 개 전체 DOM)
          </GeistButton>
          <GeistButton
            variant={mode === 'after' ? 'success' : 'outline'}
            size="sm"
            onClick={() => setMode('after')}
          >
            개선 후 (가상 스크롤 15개)
          </GeistButton>
        </div>

        <div className="flex space-x-6 font-mono text-right">
          <div>
            <div className="text-sm text-neutral-700 font-bold">활성화된 DOM 노드 수</div>
            <div
              className={`text-base font-bold ${mode === 'before' ? 'text-neutral-600' : 'text-blue-900'}`}
            >
              {mode === 'before' ? '100,000 개' : `${rowVirtualizer.getVirtualItems().length} 개`}
            </div>
          </div>
          <div>
            <div className="text-sm text-neutral-700 font-bold">스크롤 프레임</div>
            <div
              className={`text-base font-bold ${mode === 'before' ? 'text-neutral-600' : 'text-blue-900'}`}
            >
              {mode === 'before' ? '14 FPS' : '60 FPS'}
            </div>
          </div>
        </div>
      </GeistCard>

      {/* List Container */}
      <GeistCard className="bg-white border border-neutral-200">
        <div className="flex items-center justify-between mb-2 pb-2 border-b border-neutral-200 text-sm font-mono text-black font-bold">
          <span>아이템 식별번호 및 상품명</span>
          <span>판매 가격</span>
        </div>

        <div
          ref={parentRef}
          className="h-[340px] overflow-y-auto relative border border-neutral-200 rounded-lg bg-neutral-50 p-1 font-mono text-sm"
        >
          {mode === 'before' ? (
            <div className="space-y-1">
              <div className="p-2.5 bg-neutral-100 text-neutral-700 text-sm font-bold rounded border border-neutral-300 mb-2">
                ⚠️ 메모리 보호를 위해 데모용 1,000개 노드만 렌더링 중입니다.
              </div>
              {items.slice(0, 1000).map((item) => (
                <div
                  key={item.id}
                  className="h-10 flex items-center justify-between px-3 bg-white rounded border border-neutral-200 text-black font-medium"
                >
                  <span>
                    #{item.id} - {item.name}
                  </span>
                  <span className="text-blue-900 font-bold">{item.price}</span>
                </div>
              ))}
            </div>
          ) : (
            <div
              style={{
                height: `${rowVirtualizer.getTotalSize()}px`,
                width: '100%',
                position: 'relative',
              }}
            >
              {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                const item = items[virtualRow.index];
                return (
                  <div
                    key={virtualRow.key}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: `${virtualRow.size}px`,
                      transform: `translateY(${virtualRow.start}px)`,
                    }}
                    className="p-0.5"
                  >
                    <div className="h-full flex items-center justify-between px-3 bg-white rounded border border-neutral-200 hover:border-black transition">
                      <div className="flex items-center space-x-2">
                        <GeistBadge variant="mono" className="text-sm font-bold">
                          #{item.id}
                        </GeistBadge>
                        <span className="text-black font-medium">{item.name}</span>
                      </div>
                      <span className="font-bold text-blue-900">{item.price}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </GeistCard>
    </div>
  );
}
