'use client';

import { EXPERIMENTS_DATA } from '@/entities/experiment/model/experimentsData';
import { ChevronRight, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState, useEffect } from 'react';

export function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  // 페이지 경로 변경 시 모바일 사이드바 자동 닫힘
  useEffect(() => {
    if (pathname) {
      setMobileOpen(false);
    }
  }, [pathname]);

  const navContent = (
    <div className="flex flex-col h-full">
      <div className="p-3.5 border-b border-neutral-200 flex items-center justify-between">
        <Link
          href="/"
          className={`flex-1 flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-sans transition ${
            pathname === '/'
              ? 'bg-black text-white font-bold shadow-sm'
              : 'text-black font-medium hover:bg-neutral-100'
          }`}
        >
          <span className="flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="20" height="20" className="shrink-0">
              <rect width="32" height="32" rx="7" fill={pathname === '/' ? '#FFFFFF' : '#000000'} />
              <text x="6" y="23" fontFamily="Pretendard, system-ui, sans-serif" fontWeight="900" fontSize="20" fill={pathname === '/' ? '#000000' : '#FFFFFF'}>P</text>
              <path d="M21 5L15 17H20L18 27L27 13H21L23 5Z" fill="#1e3a8a" stroke="#60a5fa" strokeWidth="0.8" />
            </svg>
            <span>Front Performance Lab</span>
          </span>
        </Link>
        <button
          type="button"
          onClick={() => setMobileOpen(false)}
          className="lg:hidden ml-2 p-2 text-neutral-600 hover:text-black rounded-md border border-neutral-200"
          aria-label="메뉴 닫기"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        <div>
          <div className="px-2 mb-2 flex items-center justify-between text-sm font-mono text-neutral-700 font-bold">
            <span>성능 테스트 리스트 (20종)</span>
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
    </div>
  );

  return (
    <>
      {/* 1. 모바일 / 태블릿 상단 고정 헤더 바 (lg 미만 뷰포트) */}
      <header className="lg:hidden sticky top-0 z-40 bg-white border-b border-neutral-200 px-4 py-3 flex items-center justify-between">
        <Link
          href="/"
          className="font-bold text-black text-sm font-sans flex items-center space-x-2"
        >
          <span className="px-2 py-0.5 bg-black text-white rounded font-mono text-sm">P</span>
          <span>Frontend Performance Lab</span>
        </Link>
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="p-2 text-black border border-neutral-300 rounded-md hover:bg-neutral-100 transition flex items-center space-x-1 text-sm font-mono font-bold"
          aria-label="테스트 리스트 메뉴 열기"
        >
          <Menu className="w-5 h-5" />
          <span className="text-sm font-bold">목록</span>
        </button>
      </header>

      {/* 2. 모바일 슬라이딩 백드롭 오버레이 (lg 미만 뷰포트) */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <button
            type="button"
            className="fixed inset-0 bg-black/50 transition-opacity w-full h-full cursor-default border-0"
            onClick={() => setMobileOpen(false)}
            aria-label="사이드바 오버레이 닫기"
          />
          <aside className="relative z-10 w-80 max-w-[85vw] bg-white h-full shadow-2xl flex flex-col">
            {navContent}
          </aside>
        </div>
      )}

      {/* 3. 데스크톱 고정 사이드바 (lg 이상 뷰포트) */}
      <aside className="hidden lg:flex w-64 bg-white border-r border-neutral-200 flex-col h-screen sticky top-0 shrink-0">
        {navContent}
      </aside>
    </>
  );
}
