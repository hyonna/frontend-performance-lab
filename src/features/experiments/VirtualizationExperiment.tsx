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

        <div className="flex space-x-6 font-mono text-right shrink-0">
          <div>
            <div className="text-xs sm:text-sm text-neutral-700 font-bold">
              활성화된 DOM 노드 수
            </div>
            <div
              className={`text-sm sm:text-base font-bold ${mode === 'before' ? 'text-neutral-600' : 'text-blue-900'}`}
            >
              {mode === 'before' ? '100,000 개' : `${rowVirtualizer.getVirtualItems().length} 개`}
            </div>
          </div>
          <div>
            <div className="text-xs sm:text-sm text-neutral-700 font-bold">스크롤 프레임</div>
            <div
              className={`text-sm sm:text-base font-bold ${mode === 'before' ? 'text-neutral-600' : 'text-blue-900'}`}
            >
              {mode === 'before' ? '14 FPS' : '60 FPS'}
            </div>
          </div>
        </div>
      </div>

      {/* 2. 리스트 수직 영역 */}
      <div className="space-y-3 font-mono">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-3 text-xs sm:text-sm text-black font-bold">
          <span>아이템 식별번호 및 상품명</span>
          <span>판매 가격</span>
        </div>

        <div
          ref={parentRef}
          className="h-[340px] overflow-y-auto relative rounded-lg bg-neutral-50 p-2 font-mono text-xs sm:text-sm"
        >
          {mode === 'before' ? (
            <div className="space-y-1">
              <div className="p-2.5 bg-neutral-100 text-neutral-700 text-xs font-bold rounded mb-2">
                ⚠️ 메모리 보호를 위해 데모용 1,000개 노드만 렌더링 중입니다.
              </div>
              {items.slice(0, 1000).map((item) => (
                <div
                  key={item.id}
                  className="h-10 flex items-center justify-between px-3 bg-white rounded text-black font-medium"
                >
                  <span className="truncate pr-2">
                    #{item.id} - {item.name}
                  </span>
                  <span className="text-blue-900 font-bold shrink-0">{item.price}</span>
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
                    <div className="h-full flex items-center justify-between px-3 bg-white rounded transition">
                      <div className="flex items-center space-x-2 truncate pr-2">
                        <GeistBadge variant="mono" className="text-xs font-bold shrink-0">
                          #{item.id}
                        </GeistBadge>
                        <span className="text-black font-medium truncate">{item.name}</span>
                      </div>
                      <span className="font-bold text-blue-900 shrink-0">{item.price}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </GeistCard>
  );
}
