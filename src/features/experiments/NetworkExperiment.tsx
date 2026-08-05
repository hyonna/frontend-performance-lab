'use client';

import { GeistBadge } from '@/shared/ui/geist/GeistBadge';
import { GeistButton } from '@/shared/ui/geist/GeistButton';
import { GeistCard } from '@/shared/ui/geist/GeistCard';
import React, { useState } from 'react';

export function NetworkExperiment() {
  const [mode, setMode] = useState<'before' | 'after'>('after');
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(142);
  const [isPending, setIsPending] = useState(false);
  const [latency, setLatency] = useState<number | null>(null);

  const handleLikeToggle = () => {
    const nextLiked = !liked;
    const start = performance.now();

    if (mode === 'before') {
      setIsPending(true);
      setTimeout(() => {
        setLiked(nextLiked);
        setLikeCount((prev) => (nextLiked ? prev + 1 : prev - 1));
        setIsPending(false);
        setLatency(Number((performance.now() - start).toFixed(0)));
      }, 1000);
    } else {
      setLiked(nextLiked);
      setLikeCount((prev) => (nextLiked ? prev + 1 : prev - 1));
      setLatency(0);

      setTimeout(() => {
        // 백그라운드 API 동기화 완료
      }, 1000);
    }
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
              setLiked(false);
              setLikeCount(142);
              setLatency(null);
            }}
          >
            개선 전 모드
          </GeistButton>
          <GeistButton
            variant={mode === 'after' ? 'success' : 'outline'}
            size="sm"
            onClick={() => {
              setMode('after');
              setLiked(false);
              setLikeCount(142);
              setLatency(null);
            }}
          >
            개선 후 모드
          </GeistButton>
        </div>

        <div className="flex items-center space-x-4 font-mono sm:text-right shrink-0">
          <div>
            <div className="text-xs sm:text-sm text-neutral-700 font-bold">UI 반응 체감 속도</div>
            <div
              className={`text-sm sm:text-base font-bold ${mode === 'before' ? 'text-neutral-600' : 'text-blue-900'}`}
            >
              {mode === 'before' ? '1,000 ms (지연)' : '0 ms (즉시 지연 없음)'}
            </div>
          </div>
        </div>
      </div>

      {/* 2. 피드 좋아요 데모 */}
      <div className="space-y-3 font-mono">
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-black">피드 좋아요 낙관적 업데이트 데모</span>
          <GeistBadge variant={mode === 'before' ? 'rose' : 'blue'} className="text-xs font-bold">
            {mode === 'before' ? '응답 대기' : '0ms 낙관적 반영'}
          </GeistBadge>
        </div>

        <div className="p-4 bg-neutral-50 rounded-lg flex items-center justify-between">
          <div>
            <div className="text-sm text-black font-bold">성능 리포트 게시글</div>
            <div className="text-xs sm:text-sm text-neutral-700 mt-0.5 font-medium">
              좋아요 누적 수: <span className="font-bold text-black">{likeCount}</span> 명
            </div>
          </div>

          <button
            type="button"
            onClick={handleLikeToggle}
            disabled={isPending}
            className={`px-4 py-2 rounded-md font-mono text-xs sm:text-sm font-bold transition flex items-center space-x-1.5 ${
              liked
                ? 'bg-blue-900 text-white'
                : 'bg-neutral-200/80 text-black hover:bg-neutral-300/80'
            }`}
          >
            <span>{liked ? '❤️' : '🤍'}</span>
            <span>{isPending ? '통신 중...' : liked ? '좋아요 취소' : '좋아요'}</span>
          </button>
        </div>
      </div>

      {/* 3. 반응 지표 리포트 */}
      <div className="space-y-3 font-mono border-t border-neutral-100 pt-5">
        <h4 className="text-sm font-bold text-black">반응 지표 체감 리포트</h4>

        <div className="space-y-2 text-sm text-black font-medium">
          <div className="flex justify-between p-3 bg-neutral-50 rounded-lg">
            <span>클릭 UI 변경 지연시간:</span>
            <span
              className={
                mode === 'before' ? 'text-neutral-600 font-bold' : 'text-blue-900 font-bold'
              }
            >
              {latency !== null ? `${latency} ms` : '-'}
            </span>
          </div>
          <div className="flex justify-between p-3 bg-neutral-50 rounded-lg">
            <span>서버 오류 시 롤백 (Rollback):</span>
            <span className="font-bold">이전 스냅샷 복구 보장</span>
          </div>
        </div>
      </div>
    </GeistCard>
  );
}
