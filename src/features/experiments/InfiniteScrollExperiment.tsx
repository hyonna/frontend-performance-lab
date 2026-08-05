'use client';

import { GeistBadge } from '@/shared/ui/geist/GeistBadge';
import { GeistButton } from '@/shared/ui/geist/GeistButton';
import { GeistCard } from '@/shared/ui/geist/GeistCard';
import React, { useState } from 'react';

export function InfiniteScrollExperiment() {
  const [mode, setMode] = useState<'before' | 'after'>('after');

  return (
    <div className="space-y-4 font-sans">
      <GeistCard className="flex items-center justify-between p-4 bg-white border border-neutral-200">
        <div className="flex space-x-2">
          <GeistButton
            variant={mode === 'before' ? 'danger' : 'outline'}
            size="sm"
            onClick={() => setMode('before')}
          >
            개선 전 (Scroll Event)
          </GeistButton>
          <GeistButton
            variant={mode === 'after' ? 'success' : 'outline'}
            size="sm"
            onClick={() => setMode('after')}
          >
            개선 후 (Intersection Observer & Lock)
          </GeistButton>
        </div>

        <div className="flex space-x-6 font-mono text-right">
          <div>
            <div className="text-sm text-neutral-700 font-bold">중복 API 요청 횟수</div>
            <div
              className={`text-base font-bold ${mode === 'before' ? 'text-neutral-600' : 'text-blue-900'}`}
            >
              {mode === 'before' ? '18 회 (중복 발생)' : '0 회 (완벽 차단)'}
            </div>
          </div>
        </div>
      </GeistCard>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-sm">
        <GeistCard className="bg-white border border-neutral-200 space-y-3">
          <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
            <span className="text-sm font-bold text-black">감지 방식 및 중복 락(Lock)</span>
            <GeistBadge variant={mode === 'before' ? 'rose' : 'blue'} className="text-sm font-bold">
              {mode === 'before' ? 'Scroll Listener' : 'Intersection Observer'}
            </GeistBadge>
          </div>

          <div className="space-y-2 text-sm text-black font-medium">
            <div className="flex justify-between p-2.5 bg-neutral-50 rounded border border-neutral-200">
              <span>이벤트 호출 빈도:</span>
              <span className="font-bold">
                {mode === 'before' ? '고주파 동기 스크롤 이벤트' : '비동기 뷰포트 교차 감지'}
              </span>
            </div>
            <div className="flex justify-between p-2.5 bg-neutral-50 rounded border border-neutral-200">
              <span>isFetching 중복 락:</span>
              <span className="font-bold">
                {mode === 'before' ? '미적용 (연속 요청 발사)' : 'hasNextPage / isFetching 락 적용'}
              </span>
            </div>
          </div>
        </GeistCard>

        <GeistCard className="bg-white border border-neutral-200 space-y-3">
          <h4 className="text-sm font-bold text-black border-b border-neutral-200 pb-2">
            네트워크 트래픽 리포트
          </h4>

          <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200 text-sm text-black font-medium leading-relaxed font-sans">
            💡 <span className="font-bold">분석 가이드:</span> 스크롤 이벤트 기반 무한 스크롤은 수십
            번 중복 호출을 유발할 수 있습니다. Intersection Observer와 fetching 락을 결합하면
            불필요한 트래픽을 100% 막을 수 있습니다.
          </div>
        </GeistCard>
      </div>
    </div>
  );
}
