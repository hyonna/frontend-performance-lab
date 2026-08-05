'use client';

import React from 'react';
import { GeistBadge } from './geist/GeistBadge';
import { GeistCard } from './geist/GeistCard';

interface ReportTabsProps {
  report: {
    before: string;
    cause: string;
    appliedTech: string;
    result: string;
    retrospective: string;
  };
  codeSnippet?: {
    beforeCode: string;
    afterCode: string;
  };
  titleKo: string;
}

export function ReportTabs({ report, codeSnippet, titleKo }: ReportTabsProps) {
  return (
    <div className="space-y-6 mt-10">
      {/* 분석 문서 섹션 헤더 */}
      <div className="flex items-center justify-between pb-3 border-b border-geist-border">
        <h2 className="text-base font-bold text-black">{titleKo} — 실무 성능 종합 분석 리포트</h2>
        <GeistBadge variant="mono" className="text-sm font-semibold">
          전체 성능 분석 보고서
        </GeistBadge>
      </div>

      {/* 1. 개선 전 문제 상황 */}
      <GeistCard className="bg-white space-y-3 border-neutral-300 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="text-sm font-bold text-neutral-700">1. 개선 전 문제 상황</div>
          <GeistBadge variant="rose" className="text-sm">
            개선 전
          </GeistBadge>
        </div>
        <pre className="p-4 rounded-lg bg-neutral-50 border border-neutral-200 text-black text-sm font-sans whitespace-pre-line leading-relaxed font-medium">
          {report.before}
        </pre>
      </GeistCard>

      <div className="flex justify-center text-neutral-400 font-bold text-sm">↓</div>

      {/* 2. 성능 병목 원인 분석 */}
      <GeistCard className="bg-white space-y-3 border-neutral-300 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="text-sm font-bold text-neutral-700">2. 성능 병목 원인 분석</div>
          <GeistBadge variant="rose" className="text-sm">
            원인 분석
          </GeistBadge>
        </div>
        <pre className="p-4 rounded-lg bg-neutral-50 border border-neutral-200 text-black text-sm font-sans whitespace-pre-line leading-relaxed font-medium">
          {report.cause}
        </pre>
      </GeistCard>

      <div className="flex justify-center text-neutral-400 font-bold text-sm">↓</div>

      {/* 3. 적용한 핵심 최적화 기법 */}
      <GeistCard className="bg-white space-y-3 border-blue-200 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="text-sm font-bold text-blue-900">3. 적용한 핵심 최적화 기법</div>
          <GeistBadge variant="blue" className="text-sm">
            해결 기술
          </GeistBadge>
        </div>
        <pre className="p-4 rounded-lg bg-blue-50/50 border border-blue-200 text-black text-sm font-sans whitespace-pre-line leading-relaxed font-medium">
          {report.appliedTech}
        </pre>
      </GeistCard>

      <div className="flex justify-center text-neutral-400 font-bold text-sm">↓</div>

      {/* 4. 실무 소스코드 구현 비교 */}
      {codeSnippet && (
        <GeistCard className="bg-white space-y-4 border-neutral-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="text-sm font-bold text-black">4. 실무 소스코드 구현 비교</div>
            <GeistBadge variant="mono" className="text-sm">
              소스코드 비교
            </GeistBadge>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* 개선 전 코드 */}
            <div className="space-y-2">
              <div className="flex items-center justify-between px-3.5 py-2 bg-neutral-900 rounded-t-lg text-white font-mono text-sm">
                <span className="text-neutral-400 font-bold">개선 전 비최적화 소스</span>
                <span className="text-neutral-400 font-sans text-sm">BEFORE</span>
              </div>
              <pre className="p-4 rounded-b-lg bg-[#0f1117] border border-neutral-800 text-neutral-300 text-sm font-mono overflow-x-auto leading-relaxed h-[380px] shadow-inner">
                <code>{codeSnippet.beforeCode}</code>
              </pre>
            </div>

            {/* 개선 후 코드 */}
            <div className="space-y-2">
              <div className="flex items-center justify-between px-3.5 py-2 bg-neutral-900 rounded-t-lg text-white font-mono text-sm">
                <span className="text-blue-300 font-bold">최적화 완료 소스</span>
                <span className="text-neutral-400 font-sans text-sm">AFTER</span>
              </div>
              <pre className="p-4 rounded-b-lg bg-[#0f1117] border border-neutral-800 text-blue-200 text-sm font-mono overflow-x-auto leading-relaxed h-[380px] shadow-inner">
                <code>{codeSnippet.afterCode}</code>
              </pre>
            </div>
          </div>
        </GeistCard>
      )}

      <div className="flex justify-center text-neutral-400 font-bold text-sm">↓</div>

      {/* 5. 측정 결과 및 실무 회고 */}
      <GeistCard className="bg-white space-y-4 border-blue-200 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="text-sm font-bold text-blue-900">5. 측정 결과 및 실무 회고</div>
          <GeistBadge variant="blue" className="text-sm">
            검증 및 회고
          </GeistBadge>
        </div>

        <div className="space-y-4 font-sans text-sm">
          <div>
            <div className="text-sm text-neutral-700 font-bold uppercase mb-1.5">
              수치 개선 검증 데이터
            </div>
            <pre className="p-4 rounded-lg bg-blue-50/50 border border-blue-200 text-blue-900 font-mono text-sm whitespace-pre-line leading-relaxed font-bold">
              {report.result}
            </pre>
          </div>

          <div className="pt-2">
            <div className="text-sm text-black font-bold uppercase mb-1.5">
              실무 인프라 및 개발 회고
            </div>
            <div className="p-4 rounded-lg bg-neutral-50 border border-neutral-200 text-black text-sm whitespace-pre-line leading-relaxed font-medium">
              {report.retrospective}
            </div>
          </div>
        </div>
      </GeistCard>
    </div>
  );
}
