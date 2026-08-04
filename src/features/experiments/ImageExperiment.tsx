'use client';

import { GeistBadge } from '@/shared/ui/geist/GeistBadge';
import { GeistButton } from '@/shared/ui/geist/GeistButton';
import { GeistCard } from '@/shared/ui/geist/GeistCard';
import Image from 'next/image';
import React, { useState } from 'react';

export function ImageExperiment() {
  const [mode, setMode] = useState<'before' | 'after'>('before');
  const [lcpTime, setLcpTime] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const testImageLoad = () => {
    setLoading(true);
    setLcpTime(null);
    const start = performance.now();
    const delay = mode === 'before' ? 3200 : 800;

    setTimeout(() => {
      setLcpTime(Number(((performance.now() - start) / 1000).toFixed(2)));
      setLoading(false);
    }, delay);
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
              setLcpTime(null);
            }}
          >
            개선 전 모드
          </GeistButton>
          <GeistButton
            variant={mode === 'after' ? 'success' : 'outline'}
            size="sm"
            onClick={() => {
              setMode('after');
              setLcpTime(null);
            }}
          >
            개선 후 모드
          </GeistButton>
        </div>

        <GeistButton variant="primary" size="sm" onClick={testImageLoad} disabled={loading}>
          <span>LCP 렌더링 측정</span>
        </GeistButton>
      </GeistCard>

      {/* Image Preview & Metric */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <GeistCard className="md:col-span-2 bg-white border border-neutral-200">
          <div className="flex items-center justify-between mb-3 font-mono text-sm">
            <h4 className="font-bold text-black">히어로 배너 타겟 이미지</h4>
            <GeistBadge variant={mode === 'before' ? 'rose' : 'blue'} className="text-sm font-bold">
              {mode === 'before' ? '원본 PNG (5.2 MB)' : '최적화 WEBP (140 KB)'}
            </GeistBadge>
          </div>

          <div className="relative w-full h-60 bg-neutral-50 rounded-lg overflow-hidden border border-neutral-200 flex items-center justify-center">
            {loading ? (
              <div className="text-blue-900 font-mono text-sm font-bold">
                이미지 파일 다운로드 중...
              </div>
            ) : mode === 'before' ? (
              <img
                src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=100"
                alt="High Res Abstract"
                className="w-full h-full object-cover"
              />
            ) : (
              <Image
                src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=75"
                alt="High Res Abstract Optimized"
                fill
                sizes="(max-width: 768px) 100vw, 800px"
                priority
                className="object-cover"
              />
            )}
          </div>
        </GeistCard>

        <GeistCard className="bg-white border border-neutral-200 flex flex-col justify-between">
          <div>
            <h4 className="text-sm font-mono font-bold text-black mb-4">LCP 속도 지수 측정</h4>

            {lcpTime !== null ? (
              <div className="space-y-3 font-mono">
                <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-200">
                  <div className="text-sm text-neutral-700 mb-1 font-bold">
                    가장 큰 콘텐츠 표시 시간
                  </div>
                  <div
                    className={`text-3xl font-black ${mode === 'before' ? 'text-neutral-600' : 'text-blue-900'}`}
                  >
                    {lcpTime}초
                  </div>
                </div>

                <div className="text-sm text-black font-medium">
                  <div>
                    전송 용량:{' '}
                    <span
                      className={
                        mode === 'before' ? 'text-neutral-600 font-bold' : 'text-blue-900 font-bold'
                      }
                    >
                      {mode === 'before' ? '5.2 MB' : '140 KB (-97.3%)'}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-32 flex items-center justify-center text-sm text-neutral-700 font-mono font-medium">
                측정 버튼을 누르면 LCP 시간이 기록됩니다.
              </div>
            )}
          </div>
        </GeistCard>
      </div>
    </div>
  );
}
