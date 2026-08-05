'use client';

import type React from 'react';
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

/**
 * IDE 스타일 구문 하이라이팅 토큰 처리기
 * 외부 라이브러리 없이 정규식 기반으로 JS/TS/CSS/HTML 구문을 컬러링합니다.
 */
function highlightSyntax(code: string): React.ReactNode[] {
  const lines = code.split('\n');

  return lines.map((line, lineIdx) => {
    const tokens = tokenizeLine(line);
    return (
      <div key={lineIdx} className="flex">
        {/* 줄 번호 거터 */}
        <span className="inline-block w-8 sm:w-10 text-right pr-3 sm:pr-4 select-none text-neutral-600 shrink-0">
          {lineIdx + 1}
        </span>
        <span className="flex-1">
          {tokens.map((token, tokenIdx) => (
            <span key={tokenIdx} className={token.className}>
              {token.text}
            </span>
          ))}
        </span>
      </div>
    );
  });
}

interface Token {
  text: string;
  className: string;
}

function tokenizeLine(line: string): Token[] {
  const tokens: Token[] = [];
  let remaining = line;

  // 토큰 패턴 정의 (IDE One Dark 테마 기반 색상)
  const patterns: { regex: RegExp; className: string }[] = [
    // 한 줄 주석 (// ...) 및 CSS 주석 (/* ... */) — 회색 이탤릭
    { regex: /^(\/\/.*|\/\*.*?\*\/|\/\*.*|.*\*\/)/, className: 'text-neutral-500 italic' },
    // HTML 주석 <!-- ... -->
    { regex: /^(<!--.*?-->)/, className: 'text-neutral-500 italic' },
    // JSX/HTML 태그 열기/닫기 (<Tag>, </Tag>, <Tag />) — 붉은 주황
    { regex: /^(<\/?\w[\w.-]*\s*\/?>)/, className: 'text-[#e06c75]' },
    // HTML 속성 (key="value" 또는 key={value})
    { regex: /^(\s+[\w-]+)(?==)/, className: 'text-[#d19a66]' },
    // 문자열 리터럴 (큰따옴표/작은따옴표/백틱)
    {
      regex: /^("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)/,
      className: 'text-[#98c379]',
    },
    // 숫자 리터럴
    { regex: /^(\b\d+\.?\d*\b)/, className: 'text-[#d19a66]' },
    // JS/TS 예약어 키워드
    {
      regex:
        /^(\b(?:import|export|from|default|const|let|var|function|return|if|else|switch|case|break|async|await|new|class|extends|implements|interface|type|enum|throw|try|catch|finally|for|while|do|of|in|typeof|instanceof|void|null|undefined|true|false|this|super|yield|static|readonly|declare|module|namespace|as|is)\b)/,
      className: 'text-[#c678dd]',
    },
    // React 전용 키워드
    {
      regex:
        /^(\b(?:React|useState|useEffect|useCallback|useMemo|useRef|useContext|useReducer|useQuery|useMutation|useVirtualizer|memo|createContext|Suspense|lazy|dynamic|forwardRef|Fragment)\b)/,
      className: 'text-[#61afef]',
    },
    // CSS 속성 이름 (property: value)
    { regex: /^([\w-]+)(?=\s*:)/, className: 'text-[#56b6c2]' },
    // CSS 값 (: 뒤의 값)
    { regex: /^(:\s*)/, className: 'text-white' },
    // 화살표 함수 및 연산자
    {
      regex: /^(=>|===|!==|==|!=|&&|\|\||\.\.\.|\?\.|>=|<=|[+\-*/%])/,
      className: 'text-[#56b6c2]',
    },
    // 중괄호/소괄호/대괄호 — 밝은 노랑
    { regex: /^([{}[\]()])/, className: 'text-[#abb2bf]' },
    // 점/콤마/세미콜론
    { regex: /^([.,;])/, className: 'text-[#abb2bf]' },
    // 함수 호출 (identifier 뒤에 여는 괄호)
    { regex: /^(\w+)(?=\()/, className: 'text-[#61afef]' },
    // 일반 식별자
    { regex: /^(\w+)/, className: 'text-[#e5c07b]' },
    // 공백
    { regex: /^(\s+)/, className: '' },
    // 그 밖의 문자 1개씩 fallback
    { regex: /^(.)/, className: 'text-[#abb2bf]' },
  ];

  while (remaining.length > 0) {
    // 주석 우선 처리 (줄 전체를 소비)
    if (
      /^\s*\/\//.test(remaining) ||
      /^\s*\/\*/.test(remaining) ||
      /^\s*\*/.test(remaining) ||
      /^\s*<!--/.test(remaining)
    ) {
      tokens.push({ text: remaining, className: 'text-neutral-500 italic' });
      break;
    }

    let matched = false;
    for (const pattern of patterns) {
      const match = remaining.match(pattern.regex);
      if (match) {
        tokens.push({ text: match[0], className: pattern.className });
        remaining = remaining.slice(match[0].length);
        matched = true;
        break;
      }
    }

    if (!matched) {
      tokens.push({ text: remaining[0], className: 'text-[#abb2bf]' });
      remaining = remaining.slice(1);
    }
  }

  return tokens;
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

      {/* 4. 실무 소스코드 구현 비교 — IDE 구문 하이라이팅 적용 */}
      {codeSnippet && (
        <GeistCard className="bg-white space-y-4 border-neutral-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="text-sm font-bold text-black">4. 실무 소스코드 구현 비교</div>
            <GeistBadge variant="mono" className="text-sm">
              소스코드 비교
            </GeistBadge>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* 개선 전 코드 (IDE 다크 테마 구문 하이라이팅) */}
            <div className="space-y-0">
              <div className="flex items-center justify-between px-3.5 py-2 bg-[#21252b] rounded-t-lg font-mono text-sm border border-b-0 border-[#181a1f]">
                <span className="text-[#e06c75] font-bold">● 개선 전 비최적화 소스</span>
                <span className="text-neutral-500 font-sans text-sm">BEFORE</span>
              </div>
              <pre className="p-3 sm:p-4 rounded-b-lg bg-[#282c34] border border-[#181a1f] text-sm font-mono overflow-x-auto leading-relaxed h-[420px] shadow-inner">
                <code>{highlightSyntax(codeSnippet.beforeCode)}</code>
              </pre>
            </div>

            {/* 개선 후 코드 (IDE 다크 테마 구문 하이라이팅) */}
            <div className="space-y-0">
              <div className="flex items-center justify-between px-3.5 py-2 bg-[#21252b] rounded-t-lg font-mono text-sm border border-b-0 border-[#181a1f]">
                <span className="text-[#98c379] font-bold">● 최적화 완료 소스</span>
                <span className="text-neutral-500 font-sans text-sm">AFTER</span>
              </div>
              <pre className="p-3 sm:p-4 rounded-b-lg bg-[#282c34] border border-[#181a1f] text-sm font-mono overflow-x-auto leading-relaxed h-[420px] shadow-inner">
                <code>{highlightSyntax(codeSnippet.afterCode)}</code>
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
