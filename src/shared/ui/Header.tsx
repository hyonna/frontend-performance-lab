'use client';

import Link from 'next/link';
import React from 'react';

export function Header() {
  return (
    <header className="h-14 border-b border-geist-border bg-white flex items-center justify-between px-6 sticky top-0 z-40">
      <div className="flex items-center space-x-3">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-black rounded flex items-center justify-center text-white font-mono text-xs font-bold">
            P
          </div>
          <span className="font-bold text-black text-sm">Frontend Performance Lab</span>
        </Link>
        <span className="text-neutral-300">|</span>
        <span className="text-neutral-700 text-sm font-medium">성능 테스트</span>
      </div>
    </header>
  );
}
