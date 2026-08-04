'use client';

import type { ExperimentInfo } from '@/entities/experiment/model/experimentsData';
import { MetricCard } from '@/shared/ui/MetricCard';
import { GeistBadge } from '@/shared/ui/geist/GeistBadge';
import { GeistCard } from '@/shared/ui/geist/GeistCard';
import React from 'react';

interface ExperimentHeaderProps {
  experiment: ExperimentInfo;
}

export function ExperimentHeader({ experiment }: ExperimentHeaderProps) {
  return (
    <div className="space-y-6">
      <GeistCard className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white border border-neutral-200 shadow-sm">
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <GeistBadge variant="mono" className="text-sm font-bold">
              실험 #{experiment.number}
            </GeistBadge>
            <GeistBadge variant="default" className="text-sm font-bold">
              {experiment.category}
            </GeistBadge>
          </div>

          <h1 className="text-2xl md:text-3xl font-black text-black">{experiment.titleKo}</h1>
          <p className="text-sm font-mono text-neutral-700 font-medium">{experiment.title}</p>
          <p className="text-sm text-neutral-700 leading-relaxed max-w-2xl font-medium">
            {experiment.description}
          </p>

          <div className="flex flex-wrap gap-2 pt-2">
            {experiment.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-3 py-1 rounded-md text-sm bg-neutral-100 border border-neutral-300 text-black font-mono font-bold"
              >
                <span>{tag}</span>
              </span>
            ))}
          </div>
        </div>

        <div className="w-full md:w-80 shrink-0">
          <MetricCard
            title="성능 개선 수치 요약"
            beforeValue={experiment.beforeStats.value}
            afterValue={experiment.afterStats.value}
            improvementRate={experiment.improvementRate}
          />
        </div>
      </GeistCard>
    </div>
  );
}
