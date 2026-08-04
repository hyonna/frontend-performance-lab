import { clsx } from 'clsx';
import type React from 'react';

interface TabItem {
  id: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface GeistTabsProps {
  tabs: readonly TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
}

export function GeistTabs({ tabs, activeTab, onChange, className }: GeistTabsProps) {
  return (
    <div className={clsx('flex border-b border-geist-border bg-white overflow-x-auto', className)}>
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            type="button"
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={clsx(
              'flex items-center space-x-2 px-4 py-3 text-xs font-mono font-medium transition-all relative shrink-0',
              isActive ? 'text-black font-bold' : 'text-neutral-500 hover:text-neutral-800',
            )}
          >
            {Icon && <Icon className="w-3.5 h-3.5" />}
            <span>{tab.label}</span>

            {/* Vercel Active Tab Indicator */}
            {isActive && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-black rounded-t" />
            )}
          </button>
        );
      })}
    </div>
  );
}
