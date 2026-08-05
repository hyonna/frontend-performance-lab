'use client';

import { clsx } from 'clsx';
import React from 'react';

export interface TabItem {
  id: string;
  label: string;
  count?: number | string;
}

interface GeistTabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
}

export function GeistTabs({ tabs, activeTab, onChange, className }: GeistTabsProps) {
  return (
    <div
      className={clsx(
        'flex space-x-1 border-b border-neutral-200 bg-white px-2 pt-1 font-mono text-sm',
        className,
      )}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            type="button"
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={clsx(
              'relative px-4 py-2.5 transition-colors duration-150 font-bold',
              isActive ? 'text-black' : 'text-neutral-700 hover:text-black',
            )}
          >
            <span className="flex items-center space-x-2">
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={clsx(
                    'px-2 py-0.5 rounded text-sm',
                    isActive
                      ? 'bg-neutral-100 text-black border border-neutral-300'
                      : 'bg-neutral-100 text-neutral-700',
                  )}
                >
                  {tab.count}
                </span>
              )}
            </span>

            {/* Vercel 활성 탭 인디케이터 */}
            {isActive && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />}
          </button>
        );
      })}
    </div>
  );
}
