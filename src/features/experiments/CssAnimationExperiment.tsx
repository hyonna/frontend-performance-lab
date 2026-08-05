'use client';

import { GeistBadge } from '@/shared/ui/geist/GeistBadge';
import { GeistButton } from '@/shared/ui/geist/GeistButton';
import { GeistCard } from '@/shared/ui/geist/GeistCard';
import React, { useState } from 'react';

export function CssAnimationExperiment() {
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
            개선 전 (top / left)
          </GeistButton>
          <GeistButton
            variant={mode === 'after' ? 'success' : 'outline'}
            size="sm"
            onClick={() => setMode('after')}
          >
            개선 후 (transform / opacity GPU)
          </GeistButton>
        </div>

        <div className="flex space-x-6 font-mono text-right">
          <div>
            <div className="text-sm text-neutral-700 font-bold">렌더링 파이프라인 단계</div>
            <div
              className={`text-base font-bold ${mode === 'before' ? 'text-neutral-600' : 'text-blue-900'}`}
            >
              {mode === 'before' ? 'Layout + Paint + Composite' : 'Composite Only (GPU)'}
            </div>
          </div>
        </div>
      </GeistCard>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-sm">
        <GeistCard className="bg-white border border-neutral-200 space-y-3">
          <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
            <span className="text-sm font-bold text-black">애니메이션 처리 엔진</span>
            <GeistBadge variant={mode === 'before' ? 'rose' : 'blue'} className="text-sm font-bold">
              {mode === 'before' ? 'CPU Main Thread' : 'GPU Hardware Acceleration'}
            </GeistBadge>
          </div>

          <div className="space-y-2 text-sm text-black font-medium">
            <div className="flex justify-between p-2.5 bg-neutral-50 rounded border border-neutral-200">
              <span>Reflow 발생 여부:</span>
              <span className="font-bold">
                {mode === 'before' ? '매 프레임 Reflow 발생' : 'Reflow 0회 스킵'}
              </span>
            </div>
            <div className="flex justify-between p-2.5 bg-neutral-50 rounded border border-neutral-200">
              <span>will-change 힌트:</span>
              <span className="font-bold">
                {mode === 'before' ? '미사용' : 'will-change: transform 적용'}
              </span>
            </div>
          </div>
        </GeistCard>

        <GeistCard className="bg-white border border-neutral-200 space-y-3">
          <h4 className="text-sm font-bold text-black border-b border-neutral-200 pb-2">
            60FPS 드랍 예방 리포트
          </h4>

          <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200 text-sm text-black font-medium leading-relaxed font-sans">
            💡 <span className="font-bold">분석 가이드:</span> top/left 속성 변경은 매 프레임
            브라우저의 Layout과 Paint 단계를 유발합니다. `transform: translate3d()`와 `opacity`
            속성을 사용하면 GPU가 전담하여 메인 스레드 차단 없이 60fps 부드러운 전환을 보장합니다.
          </div>
        </GeistCard>
      </div>
    </div>
  );
}
