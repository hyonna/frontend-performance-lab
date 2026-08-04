'use client';

import { GeistBadge } from '@/shared/ui/geist/GeistBadge';
import { GeistButton } from '@/shared/ui/geist/GeistButton';
import { GeistCard } from '@/shared/ui/geist/GeistCard';
import React, { useState } from 'react';

export function AccessibilityExperiment() {
  const [mode, setMode] = useState<'before' | 'after'>('after');

  const checklist = [
    { label: '시맨틱 HTML 지원', passed: mode === 'after' },
    { label: '이미지 대치 텍스트 완비', passed: mode === 'after' },
    { label: '키보드 탭 탐색 가능', passed: mode === 'after' },
    { label: '대화형 ARIA 속성 적용', passed: mode === 'after' },
    { label: '모달 포커스 트랩 조치', passed: mode === 'after' },
  ];

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
          <div className="text-sm text-neutral-700 font-bold">라이트하우스 접근성 점수</div>
          <div
            className={`text-base font-bold ${mode === 'before' ? 'text-neutral-600' : 'text-blue-900'}`}
          >
            {mode === 'before' ? '58 점' : '100 점 (완벽)'}
          </div>
        </div>
      </GeistCard>

      {/* Checklist View */}
      <GeistCard className="bg-white border border-neutral-200">
        <h4 className="text-sm font-mono font-bold text-black mb-3">
          라이트하우스 100점 접근성 검증 항목
        </h4>

        <div className="space-y-2 font-mono text-sm">
          {checklist.map((item) => (
            <div
              key={item.label}
              className={`p-3 rounded-lg border flex items-center justify-between transition ${
                item.passed
                  ? 'bg-neutral-50 border-neutral-200 text-black font-medium'
                  : 'bg-neutral-100 border-neutral-300 text-neutral-700 font-medium'
              }`}
            >
              <span>{item.label}</span>
              <GeistBadge variant={item.passed ? 'blue' : 'rose'} className="text-sm font-bold">
                {item.passed ? '합격' : '미달'}
              </GeistBadge>
            </div>
          ))}
        </div>
      </GeistCard>
    </div>
  );
}
