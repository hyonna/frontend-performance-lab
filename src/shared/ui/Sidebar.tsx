'use client';

import { EXPERIMENTS_DATA } from '@/entities/experiment/model/experimentsData';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-r border-geist-border flex flex-col h-screen sticky top-0 shrink-0">
      <div className="p-3 border-b border-geist-border">
        <Link
          href="/"
          className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-sans transition ${
            pathname === '/'
              ? 'bg-black text-white font-bold shadow-sm'
              : 'text-black font-medium hover:bg-neutral-100'
          }`}
        >
          <span>Front Performance Lab</span>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        <div>
          <div className="px-2 mb-2 flex items-center justify-between text-sm font-mono text-neutral-700 font-bold">
            <span>성능 테스트 리스트</span>
          </div>

          <div className="space-y-1">
            {EXPERIMENTS_DATA.map((exp) => {
              const href = `/experiments/${exp.slug}`;
              const isActive = pathname === href;

              return (
                <Link
                  key={exp.id}
                  href={href}
                  className={`group flex items-center justify-between px-3 py-2.5 rounded-md text-sm transition ${
                    isActive
                      ? 'bg-black text-white font-bold shadow-sm'
                      : 'text-black font-medium hover:bg-neutral-100'
                  }`}
                >
                  <div className="flex items-center space-x-2.5 truncate">
                    <span
                      className={`text-sm font-mono px-2 py-0.5 rounded ${
                        isActive
                          ? 'bg-neutral-800 text-white font-bold'
                          : 'bg-neutral-100 text-black border border-neutral-300 font-bold'
                      }`}
                    >
                      #{exp.number}
                    </span>
                    <span className="truncate">{exp.titleKo}</span>
                  </div>
                  <ChevronRight
                    className={`w-4 h-4 shrink-0 transition ${
                      isActive ? 'text-white' : 'text-neutral-400 group-hover:text-black'
                    }`}
                  />
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </aside>
  );
}
