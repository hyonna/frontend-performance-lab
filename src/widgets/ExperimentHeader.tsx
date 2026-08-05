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
    <div className="space-y-6 font-sans">
      <GeistCard className="bg-white border border-neutral-200 shadow-sm p-6">
        <div className="space-y-3 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <GeistBadge variant="mono" className="text-sm font-bold">
              테스트 #{experiment.number}
            </GeistBadge>
            <GeistBadge variant="default" className="text-sm font-bold">
              {experiment.category}
            </GeistBadge>
          </div>

          <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-black break-words">
            {experiment.titleKo}
          </h1>

          <p className="text-sm text-neutral-700 leading-relaxed font-medium break-words">
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
      </GeistCard>
    </div>
  );
}
