'use client';

import { EXPERIMENTS_DATA } from '@/entities/experiment/model/experimentsData';
import { GeistBadge } from '@/shared/ui/geist/GeistBadge';
import { GeistButton } from '@/shared/ui/geist/GeistButton';
import { GeistCard } from '@/shared/ui/geist/GeistCard';
import Link from 'next/link';
import React from 'react';

const summery = `  성능 최적화는 단순히 'React.memo', useMemo', Code Splitting과 같은 기법을 적용하는 것이 아니라, \n성능 저하의 원인을 분석하고 상황에 맞는 해결 방법을 선택하는 과정이라고 생각합니다. 

하지만 대부분의 자료는 최적화 기법 자체를 소개하는 데 그쳐, 실제 서비스에서 어떤 문제가 발생했고 어떤 방식으로 개선되었는지, 그리고 그 결과가 얼마나 효과적이었는지 확인하기 어려웠습니다.
                    
                    이 프로젝트는 이러한 아쉬움에서 출발해 실무에서 자주 발생하는 렌더링 과다, 초기 번들 크기 증가, LCP 지연, 메모리 누수와 같은 성능 이슈를 직접 재현하고, 원인 분석부터 개선 과정까지 수치로 검증하는 테스트 플랫폼으로 제작했습니다.

                    동일한 환경에서 Before(개선 전)와 After(개선 후)를 실시간으로 비교하며 렌더링 횟수, 번들 크기, Web Vitals(LCP, INP, CLS), 메모리 사용량, 네트워크 요청 등 다양한 성능 지표의 변화를 확인할 수 있습니다. 또한 개선 전후의 소스 코드를 함께 제공하여 어떤 변경이 성능 향상으로 이어졌는지 직관적으로 이해할 수 있도록 구성했습니다.

                    이 프로젝트를 통해 단순히 최적화 기법을 알고 있다는 것을 보여주는 것이 아니라, 성능 문제를 재현하고 원인을 분석한 뒤, 적절한 해결 방안을 선택하고 객관적인 데이터로 개선 효과를 검증하는 프론트엔드 개발자의 문제 해결 과정을 보여주고자 했습니다. 
                    
                    결과적으로 실무에서도 활용할 수 있는 성능 최적화 패턴과 의사결정 과정을 경험하고, '무엇을 적용했는가'보다 '왜 이 방법을 선택했고 실제로 얼마나 개선되었는가'를 수치로 증명하는 데 초점을 맞춘 프로젝트입니다.
`;

export function MetricDashboard() {
  return (
    <div className="space-y-10">
      {/* 프로젝트 소개 및 가이드 통합 히어로 배너 카드 */}
      <GeistCard className="p-8 md:p-10 relative overflow-hidden bg-gradient-to-b from-neutral-50 via-white to-white border border-neutral-200 space-y-8">
        {/* 상단 타이틀 및 소개 */}
        <div className="w-full space-y-4">
          <h1 className="text-3xl md:text-5xl font-black text-black leading-tight">
            Frontend Performance <span className="text-neutral-700">Lab</span>
          </h1>

          {/* 히어로 배너 내 제작 의도 및 가이드 섹션 */}
          <div className="flex gap-6 pt-4">
            {/* 제작 의도 상세 카드 */}
            <div className="w-full space-y-4">
              <div className="text-black font-bold text-lg border-b border-neutral-200 pb-2">
                왜 이 프로젝트를 만들었나요?
              </div>

              <div className="space-y-4 text-sm font-sans text-neutral-700 leading-relaxed font-medium">
                {/* 섹션 1 */}
                <div className="space-y-1.5">
                  <p className="whitespace-pre-line">{summery}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </GeistCard>

      {/* 10대 최적화 테스트 리스트 그리드 */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-black">성능 최적화 리스트</h2>
            <p className="text-sm font-mono text-neutral-700 mt-0.5 font-medium">
              테스트를 선택하여 성능 변화를 직접 확인하세요.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
          {EXPERIMENTS_DATA.map((exp) => (
            <Link key={exp.id} href={`/experiments/${exp.slug}`} className="group">
              <GeistCard
                hoverable
                className="h-full flex flex-col justify-between p-5 bg-white border-neutral-200"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <GeistBadge variant="mono" className="text-sm font-bold">
                      테스트 #{exp.number}
                    </GeistBadge>
                  </div>

                  <h3 className="text-base font-bold text-black group-hover:text-neutral-700 transition">
                    {exp.titleKo}
                  </h3>
                  <p className="text-sm text-neutral-700 line-clamp-2 leading-relaxed font-sans font-normal">
                    {exp.description}
                  </p>
                </div>
              </GeistCard>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
