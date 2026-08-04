'use client';

import { GeistBadge } from '@/shared/ui/geist/GeistBadge';
import { GeistButton } from '@/shared/ui/geist/GeistButton';
import { GeistCard } from '@/shared/ui/geist/GeistCard';
import React, { useState } from 'react';

export function NetworkExperiment() {
  const [mode, setMode] = useState<'before' | 'after'>('after');
  const [likes, setLikes] = useState(42);
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [reactionDelay, setReactionDelay] = useState<string | null>(null);

  const handleLikeToggle = () => {
    const start = performance.now();

    if (mode === 'before') {
      setIsLoading(true);
      setTimeout(() => {
        setIsLiked((prev) => !prev);
        setLikes((prev) => (isLiked ? prev - 1 : prev + 1));
        setIsLoading(false);
        setReactionDelay(`${(performance.now() - start).toFixed(0)} ms (지연 발생)`);
      }, 850);
    } else {
      setIsLiked((prev) => !prev);
      setLikes((prev) => (isLiked ? prev - 1 : prev + 1));
      setReactionDelay('0 ms (즉각 체감)');

      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
      }, 850);
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

        <div className="text-right font-mono">
          <div className="text-sm text-neutral-700 font-bold">UI 체감 반응 속도</div>
          <div
            className={`text-base font-bold ${mode === 'before' ? 'text-neutral-600' : 'text-blue-900'}`}
          >
            {reactionDelay || '대기 중'}
          </div>
        </div>
      </GeistCard>

      {/* Interactive Card */}
      <GeistCard className="bg-white border border-neutral-200 flex flex-col items-center justify-center p-8 space-y-5">
        <div className="text-center space-y-1">
          <h4 className="text-base font-bold text-black font-mono">낙관적 업데이트 테스트 카드</h4>
          <p className="text-sm text-neutral-700 max-w-md font-medium">
            좋아요 버튼을 클릭해보세요. 개선 전 모드에서는 850ms 후 반응하고, 개선 후 모드에서는
            클릭 즉시 색상이 0ms에 반응합니다.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <GeistButton
            variant={isLiked ? 'primary' : 'outline'}
            size="lg"
            onClick={handleLikeToggle}
          >
            <span>아티클 좋아요</span>
            <GeistBadge variant="mono" className="ml-2 text-sm font-bold">
              {likes}
            </GeistBadge>
          </GeistButton>

          {isLoading && (
            <div className="text-sm font-mono text-blue-900 font-bold">
              {mode === 'before' ? '응답 대기...' : '백그라운드 동기화...'}
            </div>
          )}
        </div>
      </GeistCard>
    </div>
  );
}
