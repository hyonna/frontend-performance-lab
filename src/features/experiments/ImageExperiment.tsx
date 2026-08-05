'use client';

import { GeistBadge } from '@/shared/ui/geist/GeistBadge';
import { GeistButton } from '@/shared/ui/geist/GeistButton';
import { GeistCard } from '@/shared/ui/geist/GeistCard';
import Image from 'next/image';
import React, { useState } from 'react';

export function ImageExperiment() {
  const [mode, setMode] = useState<'before' | 'after'>('after');
  const [loadTime, setLoadTime] = useState<number | null>(null);

  const handleImageLoad = (startTime: number) => {
    const duration = Number((performance.now() - startTime).toFixed(0));
    setLoadTime(duration);
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
              setLoadTime(null);
            }}
          >
            개선 전 모드
          </GeistButton>
          <GeistButton
            variant={mode === 'after' ? 'success' : 'outline'}
            size="sm"
            onClick={() => {
              setMode('after');
              setLoadTime(null);
            }}
          >
            개선 후 모드
          </GeistButton>
        </div>

        <div className="flex space-x-6 font-mono text-right">
          <div>
            <div className="text-sm text-neutral-700 font-bold">이미지 데이터 크기</div>
            <div
              className={`text-base font-bold ${mode === 'before' ? 'text-neutral-600' : 'text-blue-900'}`}
            >
              {mode === 'before' ? '5.2 MB (원본 PNG)' : '140 KB (AVIF)'}
            </div>
          </div>
          <div>
            <div className="text-sm text-neutral-700 font-bold">LCP 측정 지표</div>
            <div
              className={`text-base font-bold ${mode === 'before' ? 'text-neutral-600' : 'text-blue-900'}`}
            >
              {mode === 'before' ? '3,400 ms' : '380 ms'}
            </div>
          </div>
        </div>
      </GeistCard>

      {/* 이미지 미리보기 및 지표 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <GeistCard className="bg-white border border-neutral-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-mono font-bold text-black">
                {mode === 'before' ? '비최적화 이미지' : 'next/image 최적화 이미지'}
              </span>
              <GeistBadge
                variant={mode === 'before' ? 'rose' : 'blue'}
                className="text-sm font-bold"
              >
                {mode === 'before' ? '포맷 미전환' : 'WebP/AVIF'}
              </GeistBadge>
            </div>

            <div className="relative h-56 w-full rounded-lg overflow-hidden border border-neutral-200 bg-neutral-100 flex items-center justify-center">
              {mode === 'before' ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=100"
                  alt="비최적화 원본 이미지"
                  className="w-full h-full object-cover"
                  onLoad={() => handleImageLoad(performance.now())}
                />
              ) : (
                <Image
                  src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=75"
                  alt="최적화 변환 이미지"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                  className="object-cover"
                  onLoad={() => handleImageLoad(performance.now())}
                />
              )}
            </div>
          </div>
        </GeistCard>

        <GeistCard className="bg-white border border-neutral-200 flex flex-col justify-between space-y-4 font-mono">
          <div>
            <h4 className="text-sm font-bold text-black mb-3">이미지 수치 분석 스펙</h4>

            <div className="space-y-2 text-sm text-black font-medium">
              <div className="flex justify-between p-2.5 bg-neutral-50 rounded border border-neutral-200">
                <span>이미지 규격 포맷:</span>
                <span className="font-bold">
                  {mode === 'before' ? 'PNG (Uncompressed)' : 'AVIF / WebP (Modern)'}
                </span>
              </div>
              <div className="flex justify-between p-2.5 bg-neutral-50 rounded border border-neutral-200">
                <span>Lazy Loading 적용:</span>
                <span className="font-bold">
                  {mode === 'before' ? '미적용' : '우선순위(priority) 로드'}
                </span>
              </div>
              <div className="flex justify-between p-2.5 bg-neutral-50 rounded border border-neutral-200">
                <span>레이아웃 시프트 (CLS):</span>
                <span
                  className={
                    mode === 'before' ? 'text-neutral-600 font-bold' : 'text-blue-900 font-bold'
                  }
                >
                  {mode === 'before' ? '0.34 (이동 발생)' : '0.00 (공간 확보)'}
                </span>
              </div>
            </div>
          </div>

          <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200 text-sm font-mono text-black font-medium">
            💡 <span className="font-bold">최적화 가이드:</span> LCP 타겟 이미지는 Next.js Image의{' '}
            <code className="font-bold">priority</code> 속성을 명시하여 프리로드(Preload)를
            유도하세요.
          </div>
        </GeistCard>
      </div>
    </div>
  );
}
