'use client';

import { GeistBadge } from '@/shared/ui/geist/GeistBadge';
import { GeistButton } from '@/shared/ui/geist/GeistButton';
import { GeistCard } from '@/shared/ui/geist/GeistCard';
import React, { useState } from 'react';

export function ScriptLoadingExperiment() {
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
            개선 전 (Sync Head Script)
          </GeistButton>
          <GeistButton
            variant={mode === 'after' ? 'success' : 'outline'}
            size="sm"
            onClick={() => setMode('after')}
          >
            개선 후 (next/script lazyOnload)
          </GeistButton>
        </div>

        <div className="flex space-x-6 font-mono text-right">
          <div>
            <div className="text-sm text-neutral-700 font-bold">초기 렌더링 차단 (FCP)</div>
            <div
              className={`text-base font-bold ${mode === 'before' ? 'text-neutral-600' : 'text-blue-900'}`}
            >
              {mode === 'before' ? '3.2 초 (차단 지연)' : '0.8 초 (초고속)'}
            </div>
          </div>
        </div>
      </GeistCard>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-sm">
        <GeistCard className="bg-white border border-neutral-200 space-y-3">
          <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
            <span className="text-sm font-bold text-black">서드파티 스크립트 로드 전략</span>
            <GeistBadge variant={mode === 'before' ? 'rose' : 'blue'} className="text-sm font-bold">
              {mode === 'before' ? 'Blocking Script Tag' : 'next/script Strategy'}
            </GeistBadge>
          </div>

          <div className="space-y-2 text-sm text-black font-medium">
            <div className="flex justify-between p-2.5 bg-neutral-50 rounded border border-neutral-200">
              <span>애널리틱스 / 광고 로딩:</span>
              <span className="font-bold">
                {mode === 'before' ? 'Head 동기 파싱 (HTML 중단)' : 'strategy="lazyOnload" 로딩'}
              </span>
            </div>
            <div className="flex justify-between p-2.5 bg-neutral-50 rounded border border-neutral-200">
              <span>메인 스레드 점유율:</span>
              <span className="font-bold">
                {mode === 'before' ? '높음 (수화 지연)' : '최소화 (핵심 UI 우선)'}
              </span>
            </div>
          </div>
        </GeistCard>

        <GeistCard className="bg-white border border-neutral-200 space-y-3">
          <h4 className="text-sm font-bold text-black border-b border-neutral-200 pb-2">
            Web Vitals FCP 지표 리포트
          </h4>

          <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200 text-sm text-black font-medium leading-relaxed font-sans">
            💡 <span className="font-bold">분석 가이드:</span> 외부 챗봇, 애널리틱스, 광고
            스크립트가 상단 동기 태그로 포함되면 메인 스레드가 블로킹되어 FCP가 3초 이상 늦어집니다.
            Next.js Script의 `lazyOnload` 전략을 사용하면 초기 화면 서빙 후 비동기로 불러와 75%
            빨라집니다.
          </div>
        </GeistCard>
      </div>
    </div>
  );
}
