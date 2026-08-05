'use client';

import { GeistBadge } from '@/shared/ui/geist/GeistBadge';
import { GeistButton } from '@/shared/ui/geist/GeistButton';
import { GeistCard } from '@/shared/ui/geist/GeistCard';
import React, { useState } from 'react';

export function BundleExperiment() {
  const [mode, setMode] = useState<'before' | 'after'>('before');
  const [downloadTime, setDownloadTime] = useState<number | null>(null);

  const simulateDownload = () => {
    setDownloadTime(null);
    const start = performance.now();
    const delay = mode === 'before' ? 1400 : 200;

    setTimeout(() => {
      setDownloadTime(Number((performance.now() - start).toFixed(0)));
    }, delay);
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
              setDownloadTime(null);
            }}
          >
            개선 전 모드
          </GeistButton>
          <GeistButton
            variant={mode === 'after' ? 'success' : 'outline'}
            size="sm"
            onClick={() => {
              setMode('after');
              setDownloadTime(null);
            }}
          >
            개선 후 모드
          </GeistButton>
        </div>

        <GeistButton variant="primary" size="sm" onClick={simulateDownload}>
          <span>번들 다운로드 시뮬레이션</span>
        </GeistButton>
      </div>

      {/* 2. 웹팩 번들 청크 구조 분석 */}
      <div className="space-y-3 font-mono">
        <h4 className="text-sm font-bold text-black">웹팩 번들 청크 구조 분석</h4>

        <div className="space-y-3 text-sm">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-black font-medium">메인 번들 (app/page.js)</span>
              <span
                className={
                  mode === 'before' ? 'text-neutral-600 font-bold' : 'text-blue-900 font-bold'
                }
              >
                {mode === 'before' ? '2,800 KB' : '480 KB'}
              </span>
            </div>
            <div className="w-full h-3.5 bg-neutral-100 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${mode === 'before' ? 'w-full bg-neutral-400' : 'w-[17%] bg-blue-900'}`}
              />
            </div>
          </div>

          {mode === 'after' && (
            <div className="p-3 bg-neutral-50 rounded-lg space-y-1.5 text-black">
              <div className="text-sm text-blue-900 font-bold mb-1">
                동적 분리된 자바스크립트 청크:
              </div>
              <div className="flex justify-between font-medium">
                <span>chunk-rich-editor.js</span>
                <span className="font-bold">1,400 KB</span>
              </div>
              <div className="flex justify-between font-medium">
                <span>chunk-chart-analytics.js</span>
                <span className="font-bold">920 KB</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3. 초기 자바스크립트 다운로드 및 수화 성능 */}
      <div className="space-y-3 font-mono border-t border-neutral-100 pt-5">
        <h4 className="text-sm font-bold text-black">초기 자바스크립트 다운로드 및 수화 성능</h4>

        {downloadTime !== null ? (
          <div className="space-y-3">
            <div className="p-4 bg-neutral-50 rounded-lg">
              <div className="text-sm text-neutral-700 mb-1 font-bold">
                총 다운로드 및 파싱 시간
              </div>
              <div
                className={`text-2xl font-black ${mode === 'before' ? 'text-neutral-600' : 'text-blue-900'}`}
              >
                {downloadTime} ms
              </div>
            </div>

            <div className="text-sm text-black space-y-1 font-medium">
              <div>
                총 차단 시간:{' '}
                <span className="text-black font-bold">
                  {mode === 'before' ? '640ms (위험)' : '35ms (양호)'}
                </span>
              </div>
              <div className="flex items-center space-x-2 pt-1">
                <span>초기 로딩 상태:</span>
                <GeistBadge
                  variant={mode === 'before' ? 'rose' : 'blue'}
                  className="text-xs font-bold"
                >
                  {mode === 'before' ? '지연 발생' : '즉각 로드 완료'}
                </GeistBadge>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6 bg-neutral-50 rounded-lg text-center text-sm text-neutral-700 font-medium">
            위의 '번들 다운로드 시뮬레이션' 버튼을 눌러 테스트해보세요.
          </div>
        )}
      </div>
    </GeistCard>
  );
}
