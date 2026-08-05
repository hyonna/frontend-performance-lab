'use client';

import { GeistBadge } from '@/shared/ui/geist/GeistBadge';
import { GeistButton } from '@/shared/ui/geist/GeistButton';
import { GeistCard } from '@/shared/ui/geist/GeistCard';
import type React from 'react';
import { useRef, useState } from 'react';

export function SearchExperiment() {
  const [mode, setMode] = useState<'before' | 'after'>('after');
  const [searchTerm, setSearchTerm] = useState('');
  const [requestCount, setRequestCount] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (mode === 'before') {
      if (value.trim() !== '') {
        triggerApiCall(value);
      }
    } else {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        if (value.trim() !== '') {
          triggerApiCall(value);
        }
      }, 300);
    }
  };

  const triggerApiCall = (query: string) => {
    setRequestCount((prev) => prev + 1);
    const timestamp = new Date().toLocaleTimeString();
    setLogs((prev) => [`[${timestamp}] GET /api/search?q="${query}"`, ...prev.slice(0, 7)]);
  };

  const clearLogs = () => {
    setSearchTerm('');
    setRequestCount(0);
    setLogs([]);
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
              clearLogs();
            }}
          >
            개선 전 모드
          </GeistButton>
          <GeistButton
            variant={mode === 'after' ? 'success' : 'outline'}
            size="sm"
            onClick={() => {
              setMode('after');
              clearLogs();
            }}
          >
            개선 후 모드
          </GeistButton>
        </div>

        <div className="flex items-center space-x-4 font-mono sm:text-right shrink-0">
          <div>
            <div className="text-xs sm:text-sm text-neutral-700 font-bold">누적 API 요청 수</div>
            <div
              className={`text-sm sm:text-base font-bold ${mode === 'before' ? 'text-neutral-600' : 'text-blue-900'}`}
            >
              {requestCount} 회
            </div>
          </div>
          <GeistButton variant="outline" size="sm" onClick={clearLogs}>
            초기화
          </GeistButton>
        </div>
      </div>

      {/* 2. 검색 입력 샌드박스 */}
      <div className="space-y-3 font-mono">
        <label
          htmlFor="search-input"
          className="text-sm font-bold text-black flex items-center justify-between"
        >
          <span>검색 입력 샌드박스</span>
        </label>

        <div className="relative">
          <input
            id="search-input"
            type="text"
            value={searchTerm}
            onChange={handleInputChange}
            placeholder="검색어를 입력해보세요 (예: 성능 최적화)..."
            className="w-full px-3.5 py-2.5 bg-neutral-50 rounded-md text-black placeholder-neutral-500 focus:outline-none focus:bg-neutral-100/80 font-mono text-sm font-medium transition"
          />
        </div>

        <div className="p-3 bg-neutral-50 rounded-md text-xs sm:text-sm font-mono text-black space-y-1 font-medium">
          <div className="flex items-center space-x-2">
            <span>모드:</span>
            <GeistBadge variant={mode === 'before' ? 'rose' : 'blue'} className="text-xs font-bold">
              {mode === 'before' ? '개선 전' : '개선 후'}
            </GeistBadge>
          </div>
          <div>
            동작 설명:{' '}
            {mode === 'before'
              ? '키다운 마다 API 즉시 발사 (서버 트래픽 과부하)'
              : '입력 멈춘 후 300ms 뒤 단 1회 최적화 요청'}
          </div>
        </div>
      </div>

      {/* 3. 네트워크 콘솔 터미널 */}
      <div className="space-y-3 font-mono border-t border-neutral-100 pt-5">
        <h4 className="text-sm font-bold text-black">네트워크 콘솔 터미널</h4>

        <div className="h-40 overflow-y-auto bg-[#0f1117] p-3.5 rounded-md space-y-1.5 font-mono text-xs sm:text-sm">
          {logs.length > 0 ? (
            logs.map((log) => (
              <div
                key={log}
                className={
                  mode === 'before' ? 'text-neutral-400 font-medium' : 'text-blue-300 font-medium'
                }
              >
                🚀 {log}
              </div>
            ))
          ) : (
            <div className="text-neutral-500 flex items-center justify-center h-full font-medium">
              검색어를 타이핑하면 터미널에 로그가 출력됩니다.
            </div>
          )}
        </div>
      </div>
    </GeistCard>
  );
}
