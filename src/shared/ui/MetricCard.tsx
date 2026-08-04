'use client';

import React from 'react';
import { GeistBadge } from './geist/GeistBadge';
import { GeistCard } from './geist/GeistCard';

interface MetricCardProps {
  title: string;
  beforeValue: string;
  afterValue: string;
  improvementRate: string;
  description?: string;
}

export function MetricCard({
  title,
  beforeValue,
  afterValue,
  improvementRate,
  description,
}: MetricCardProps) {
  return (
    <GeistCard className="relative overflow-hidden bg-white border border-neutral-200">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-mono text-black font-bold uppercase tracking-wider">{title}</h4>
        <GeistBadge variant="blue" className="text-sm font-bold">
          <span>{improvementRate}</span>
        </GeistBadge>
      </div>

      <div className="grid grid-cols-2 gap-4 items-center bg-neutral-50 rounded-lg p-3.5 border border-neutral-200 font-mono">
        <div>
          <div className="text-xs text-neutral-600 uppercase tracking-wider mb-0.5 font-bold">
            개선 전
          </div>
          <div className="text-base font-bold text-neutral-600 line-through">{beforeValue}</div>
        </div>

        <div className="border-l border-neutral-200 pl-4">
          <div className="text-xs text-blue-900 uppercase tracking-wider mb-0.5 font-bold">
            개선 후
          </div>
          <div className="text-lg font-black text-blue-900">{afterValue}</div>
        </div>
      </div>

      {description && (
        <p className="text-sm text-neutral-700 mt-3 leading-relaxed font-sans font-medium">
          {description}
        </p>
      )}
    </GeistCard>
  );
}
