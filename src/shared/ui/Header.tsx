'use client';

import Link from 'next/link';
import React from 'react';
import { GeistBadge } from './geist/GeistBadge';

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-geist-border bg-white/90 backdrop-blur-md">
      <div className="flex h-14 items-center justify-between px-6">
        <div className="flex items-center space-x-3">
          <Link href="/" className="flex items-center space-x-2.5 group">
            <div className="w-5 h-5 bg-black text-white flex items-center justify-center rounded clip-path-triangle font-mono text-sm font-black">
              ▲
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-sm tracking-tight text-black group-hover:text-neutral-700 transition">
                성능 실험실
              </span>
              <span className="text-sm font-mono px-2 py-0.5 rounded bg-neutral-100 text-black border border-neutral-300 font-bold">
                v1.0
              </span>
            </div>
          </Link>
        </div>

        {/* Metric Summaries - No Icons & 14px Text & 4-Color Palette */}
        <div className="hidden md:flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-neutral-50 px-3 py-1.5 rounded-md border border-neutral-200 text-sm font-mono font-bold">
            <span className="text-black">라이트하우스:</span>
            <span className="text-rose-600 line-through">42</span>
            <span className="text-neutral-400">➔</span>
            <span className="text-blue-600">100점</span>
          </div>

          <div className="flex items-center space-x-2 bg-neutral-50 px-3 py-1.5 rounded-md border border-neutral-200 text-sm font-mono font-bold">
            <span className="text-black">LCP:</span>
            <span className="text-rose-600 line-through">5.4s</span>
            <span className="text-neutral-400">➔</span>
            <span className="text-blue-600">1.2s</span>
          </div>

          <div className="flex items-center space-x-2 bg-neutral-50 px-3 py-1.5 rounded-md border border-neutral-200 text-sm font-mono font-bold">
            <span className="text-black">번들크기:</span>
            <span className="text-rose-600 line-through">2.8MB</span>
            <span className="text-neutral-400">➔</span>
            <span className="text-blue-600">480KB</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <GeistBadge variant="mono" className="text-sm font-bold">
            FSD 아키텍처
          </GeistBadge>
        </div>
      </div>
    </header>
  );
}
