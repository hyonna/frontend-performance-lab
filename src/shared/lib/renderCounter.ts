import { useEffect, useRef } from 'react';

/**
 * 컴포넌트가 리렌더링된 횟수를 추적하는 훅
 */
export function useRenderCounter(name: string) {
  const countRef = useRef(1);

  useEffect(() => {
    countRef.current += 1;
  });

  return countRef.current;
}
