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
    <div className="space-y-4">
      {/* 모드 스위처 */}
      <GeistCard className="flex items-center justify-between p-4 bg-white border border-neutral-200">
        <div className="flex space-x-2">
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
      </GeistCard>

      {/* 시각적 구조 분석 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <GeistCard className="bg-white border border-neutral-200">
          <h4 className="text-sm font-mono font-bold text-black mb-4">웹팩 번들 청크 구조 분석</h4>

          <div className="space-y-3 font-mono text-sm">
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
              <div className="w-full h-3.5 bg-neutral-100 rounded-full overflow-hidden border border-neutral-200">
                <div
                  className={`h-full transition-all duration-500 ${mode === 'before' ? 'w-full bg-neutral-400' : 'w-[17%] bg-blue-900'}`}
                />
              </div>
            </div>

            {mode === 'after' && (
              <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200 space-y-1.5 text-black">
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
        </GeistCard>

        <GeistCard className="bg-white border border-neutral-200 flex flex-col justify-between">
          <div>
            <h4 className="text-sm font-mono font-bold text-black mb-4">
              초기 자바스크립트 다운로드 및 수화 성능
            </h4>

            {downloadTime !== null ? (
              <div className="space-y-3 font-mono">
                <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-200">
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
                      className="text-sm font-bold"
                    >
                      {mode === 'before' ? '지연 발생' : '즉각 로드 완료'}
                    </GeistBadge>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-28 flex items-center justify-center text-sm text-neutral-700 font-mono font-medium">
                위의 버튼을 눌러 번들 다운로드를 시뮬레이션하세요.
              </div>
            )}
          </div>
        </GeistCard>
      </div>
    </div>
  );
}
