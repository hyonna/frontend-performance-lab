export interface ExperimentInfo {
  id: string;
  slug: string;
  number: number;
  title: string;
  titleKo: string;
  category: string;
  description: string;
  beforeStats: {
    label: string;
    value: string;
  };
  afterStats: {
    label: string;
    value: string;
  };
  improvementRate: string;
  tags: string[];
  report: {
    before: string;
    cause: string;
    appliedTech: string;
    result: string;
    retrospective: string;
  };
  codeSnippet: {
    beforeCode: string;
    afterCode: string;
  };
}

export const EXPERIMENTS_DATA: ExperimentInfo[] = [
  {
    id: 'rendering',
    slug: 'rendering',
    number: 1,
    title: 'Rendering Optimization',
    titleKo: '불필요한 리렌더링 최적화',
    category: '리액트 코어',
    description:
      '단일 상태 저장소나 부모 컴포넌트의 리렌더링으로 인해 수정되지 않은 하위 100여 개 컴포넌트까지 몽땅 재렌더링되며 화면 스크롤과 타이핑 반응 속도가 느려지는 문제를 최적화합니다.',
    beforeStats: { label: '렌더링 횟수', value: '142 회' },
    afterStats: { label: '렌더링 횟수', value: '12 회' },
    improvementRate: '-91.5%',
    tags: ['React.memo', 'useCallback', '상태 분리', 'Selector'],
    report: {
      before:
        '쇼핑몰 장바구니 페이지에서 상품 수량을 하나 늘릴 때마다, 장바구니 상태 전체가 변경되면서 상단 프로필 헤더, 추천 상품 리스트, 배송비 계산기 등 독립된 140여 개 하위 컴포넌트가 전부 리렌더링되어 타이핑 딜레이가 발생함.',
      cause:
        'React Context API 기본 동작상 Provider의 value 객체에 새로운 참조값이 할당되면, useContext를 사용하는 모든 자식 컴포넌트가 무조건 전체 재렌더링됨. 또한 인라인 콜백 전달로 인해 메모이제이션이 무효화됨.',
      appliedTech:
        '1. 상태 컨텍스트와 디스패치 컨텍스트를 물리적으로 분리\n2. Zustand Selector 패턴으로 필요한 상태 조각만 구독\n3. 무거운 하위 컴포넌트에 React.memo 및 useCallback 적용하여 렌더링 스킵',
      result:
        '수량 변경 버튼 클릭 시 관련 컴포넌트 1개만 렌더링되어 총 렌더링 횟수가 142회에서 12회로 감소 (91.5% 개선).',
      retrospective:
        '무조건 React.memo만 붙인다고 다 해결되는 게 아니라, 상태(state)가 어디에 있고 컴포넌트가 어디서 값을 가져오는지 위치를 맞춰주는 게 진짜 중요하다는 걸 알았습니다. 실제 프로젝트에서도 무작정 다 감싸기보다는 진짜 렌더링이 튀는 곳만 콕 집어서 고치는 감을 잡게 되었습니다.',
    },
    codeSnippet: {
      beforeCode: `// ❌ 개선 전: 전체 컨텍스트 구독 및 인라인 함수 전달 (전체 재렌더링 발생)
const GlobalContext = createContext();

export function ParentProvider({ children }) {
  const [user, setUser] = useState({ name: '김개발', count: 0 });
  
  // 객체가 매번 새로 생성되어 자식 컴포넌트에 전달됨
  return (
    <GlobalContext.Provider value={{ user, setUser }}>
      {children}
    </GlobalContext.Provider>
  );
}

function ItemList() {
  const { user, setUser } = useContext(GlobalContext); // user 갱신 시 무조건 리렌더링!
  return items.map(item => <Item key={item.id} onClick={() => setUser(...)} />);
}`,
      afterCode: `// ✅ 개선 후: Zustand Selector 패턴 및 React.memo 적용 (필요한 소스만 렌더링)
import { memo, useCallback } from 'react';
import { useStore } from '@/store';

// 1. Selector로 필요한 값만 추출하여 불필요한 리렌더링 방지
const ItemCount = memo(function ItemCount() {
  const count = useStore((state) => state.count);
  return <span>{count}</span>;
});

// 2. useCallback과 memo 결합
const FastItem = memo(function FastItem({ id, onSelect }) {
  return <button onClick={() => onSelect(id)}>아이템 #{id}</button>;
});`,
    },
  },
  {
    id: 'bundle',
    slug: 'bundle',
    number: 2,
    title: 'Bundle Optimization',
    titleKo: '초기 번들 크기 절감',
    category: '빌드 및 배포',
    description:
      '특정 모달에서만 쓰이는 대용량 차트 라이브러리와 에디터가 메인 번들에 통째로 포함되어 초기 페이지 접속 시 백화 현상이 지연되는 문제를 동적 임포트로 개선합니다.',
    beforeStats: { label: '초기 자바스크립트 크기', value: '2.8 MB' },
    afterStats: { label: '초기 자바스크립트 크기', value: '480 KB' },
    improvementRate: '-82.8%',
    tags: ['동적 임포트', '트리쉐이킹', '코드 스플리팅'],
    report: {
      before:
        "어드민 대시보드 및 상세 페이지에서 '리포트 다운로드 모달' 내 차트 라이브러리와 리치 텍스트 에디터가 정적 import로 작성되어, 첫 접속 유저가 보지도 않는 2.3MB 분량의 코드를 초기에 다운로드받느라 로딩에 3초 이상 소요됨.",
      cause:
        '파일 상단의 정적 import 구문으로 인해 웹팩이 메인 bundle.js 번들에 포함시켜 자바스크립트 실행 전까지 렌더링이 차단됨 (총 차단 시간 증가).',
      appliedTech:
        '1. Next.js next/dynamic 모듈을 활용하여 해당 모달이 열리는 시점에 비동기 자바스크립트 로드\n2. 트리쉐이킹 지원 미흡 라이브러리를 lodash-es 등 ES Module 라이브러리로 대체',
      result:
        '초기 페이지 자바스크립트 다운로드 용량이 2.8MB에서 480KB로 82.8% 급감, 초기 렌더링 타임 대폭 단축.',
      retrospective:
        '첫 페이지 하나 띄우는데 당장 쓰지도 않는 대형 차트 라이브러리나 텍스트 에디터까지 한꺼번에 다 불러오니 화면이 늦게 뜰 수밖에 없었습니다. dynamic import로 사용자가 진짜 클릭할 때만 불러오도록 쪼개주니 초기 속도가 바로 눈에 띄게 가벼워졌습니다.',
    },
    codeSnippet: {
      beforeCode: `// ❌ 개선 전: 정적 import - 초기 번들에 2.3MB 라이브러리 강제 포함
import { HeavyChart } from 'heavy-chart-library';
import { RichTextEditor } from 'huge-editor-library';

export default function DashboardPage() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div>
      <button onClick={() => setIsOpen(true)}>모달 열기</button>
      {isOpen && <HeavyChart />}
    </div>
  );
}`,
      afterCode: `// ✅ 개선 후: next/dynamic 비동기 코드 분할 (동적 임포트)
import dynamic from 'next/dynamic';

// 모달이 실제로 렌더링되는 시점에 자바스크립트 청크 다운로드
const HeavyChart = dynamic(() => import('heavy-chart-library'), {
  loading: () => <p>차트 로딩 중...</p>,
  ssr: false, // 클라이언트 사이드 렌더링 전용
});

export default function DashboardPage() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div>
      <button onClick={() => setIsOpen(true)}>모달 열기</button>
      {isOpen && <HeavyChart />}
    </div>
  );
}`,
    },
  },
  {
    id: 'image',
    slug: 'image',
    number: 3,
    title: 'Image Optimization',
    titleKo: '이미지 최적화 및 LCP 개선',
    category: '웹 바이탈',
    description:
      '디자이너가 전달한 5MB 원본 PNG 히어로 배너 이미지를 그대로 서빙하여 모바일 LCP 점수가 5.4초 지연되는 문제를 next/image 기반 최신 포맷 변환으로 해결합니다.',
    beforeStats: { label: 'LCP 이미지 표시 시간', value: '5.4 초' },
    afterStats: { label: 'LCP 이미지 표시 시간', value: '1.2 초' },
    improvementRate: '-77.7%',
    tags: ['next/image', 'WebP/AVIF', '지연 로딩', '블러 블레이스홀더'],
    report: {
      before:
        '프로모션 메인 이벤트 페이지의 메인 히어로 배너 이미지가 5.2MB PNG 원본 그대로 img 태그로 서빙되어, 모바일 환경 유저의 LCP 속도가 5.4초로 측정되며 이탈률 상승.',
      cause:
        '이미지 포맷 압축 미적용, 반응형 뷰포트 크기 미대응, 뷰포트 밖 이미지의 조기 다운로드로 인한 네트워크 대역폭 병목.',
      appliedTech:
        '1. next/image로 자동 WebP/AVIF 압축 서빙 및 뷰포트별 srcset 반응형 변환\n2. LCP 대상인 최상단 히어로 이미지는 priority 속성 부여\n3. 하단 이미지는 지연 로딩 및 블러 플레이스홀더 적용',
      result:
        '이미지 패킷 크기가 5.2MB에서 140KB로 절감되며 LCP 타임이 5.4초에서 1.2초로 대폭 개선.',
      retrospective:
        '스마트폰 카메라로 찍은 몇 메가짜리 커다란 원본 사진을 그대로 웹페이지에 올리면 데이터도 많이 먹고 화면이 흔들립니다. Next.js Image로 폰에 맞는 적절한 크기와 최신 이미지 형식(AVIF, WebP)으로 자동으로 바꿔서 보내주니 유저 입장에서도 끊김 없이 바로 보이는 게 참 좋았습니다.',
    },
    codeSnippet: {
      beforeCode: `// ❌ 개선 전: 원본 PNG 이미지를 기본 img 태그로 직접 서빙 (5.2MB 전송)
export function HeroBanner() {
  return (
    <img
      src="/hero-banner-original.png"
      alt="프로모션 배너"
      className="w-full h-auto"
    />
  );
}`,
      afterCode: `// ✅ 개선 후: next/image 사용 - WebP/AVIF 자동 변환 & priority 설정
import Image from 'next/image';

export function HeroBanner() {
  return (
    <Image
      src="/hero-banner-original.png"
      alt="프로모션 배너"
      width={1200}
      height={600}
      priority // LCP 리소스 우선 다운로드 설정
      sizes="(max-width: 768px) 100vw, 1200px"
      placeholder="blur"
    />
  );
}`,
    },
  },
  {
    id: 'rendering-strategy',
    slug: 'rendering-strategy',
    number: 4,
    title: 'Rendering Strategy Comparison',
    titleKo: '렌더링 전략 비교',
    category: '아키텍처',
    description:
      '모든 데이터를 CSR 방식으로 불러와 첫 화면 백화 현상과 SEO 불이익을 겪는 문제를 페이지 특성에 맞춘 SSG/ISR/SSR 하이브리드 아키텍처로 개선합니다.',
    beforeStats: { label: 'CSR 응답 및 표시 시간', value: '1.8초 / 2.4초' },
    afterStats: { label: 'ISR 응답 및 표시 시간', value: '45ms / 0.3초' },
    improvementRate: '응답속도 97% 개선',
    tags: ['CSR', 'SSR', 'SSG', 'ISR'],
    report: {
      before:
        '상품 상세 페이지를 순수 CSR로 구현했을 때, 검색 엔진 크롤러가 상품 정보를 수집하지 못해 SEO 검색 노출이 차단되고, 유저는 자바스크립트 로딩 후 API 응답까지 2.4초 동안 빈 화면을 지켜봐야 함.',
      cause:
        '클라이언트 측 브라우저 자바스크립트 다운로드 ➔ 파싱 ➔ API 요청 ➔ DOM 생성으로 이어지는 긴 비동기 렌더링 워터폴 구조.',
      appliedTech:
        '1. 정적 홍보 및 소개 페이지는 빌드 시점 생성을 위한 SSG 전략 적용\n2. 주기적 가격 갱신이 필요한 상품 페이지는 ISR 적용\n3. 유저 개인화 정보는 SSR 하이브리드 배치',
      result:
        'Edge CDN에서 즉시 응답하는 ISR 적용 페이지의 응답 시간이 1.8초에서 45ms로 대폭 단축.',
      retrospective:
        '무조건 SSR이 다 좋은 줄 알았는데, 자주 변하지 않는 페이지는 SSG나 ISR로 서버가 미리 만들어둔 정적 파일만 툭 던져주는 게 훨씬 빠르고 서버 비용도 아낄 수 있다는 걸 체감했습니다. 상황에 맞게 렌더링 방식을 적절히 골라 써야 한다는 점을 깊이 이해하게 되었습니다.',
    },
    codeSnippet: {
      beforeCode: `// ❌ 개선 전: 순수 CSR - 빈 HTML 반환 후 브라우저에서 useEffect API 호출 (SEO 불리, 2.4초 지연)
export default function ProductPage() {
  const [data, setData] = useState(null);
  useEffect(() => {
    fetch('/api/product').then(res => res.json()).then(setData);
  }, []);

  if (!data) return <div>로딩 중...</div>;
  return <div>{data.title}</div>;
}`,
      afterCode: `// ✅ 개선 후: Next.js ISR - 45ms 초고속 응답 반환 및 SEO 완전 지원
export async function getStaticProps() {
  const res = await fetch('https://api.example.com/product/1');
  const product = await res.json();

  return {
    props: { product },
    revalidate: 60, // 60초마다 백그라운드 재검증 및 CDN 정적 갱신
  };
}

export default function ProductPage({ product }) {
  return <div>{product.title}</div>;
}`,
    },
  },
  {
    id: 'virtualization',
    slug: 'virtualization',
    number: 5,
    title: 'Massive List Virtualization',
    titleKo: '10만 개 대용량 리스트 가상화',
    category: 'DOM 및 메모리',
    description:
      '10,000개 이상의 상품 목록이나 로그 데이터를 무한 스크롤로 불러올 때 DOM 노드 수가 수만 개로 늘어나며 브라우저 스크롤 프레임이 14 FPS로 떨어지는 문제를 뷰포트 가상 스크롤로 해결합니다.',
    beforeStats: { label: 'DOM 노드 수 / 프레임', value: '10만개 / 14 FPS' },
    afterStats: { label: 'DOM 노드 수 / 프레임', value: '15개 / 60 FPS' },
    improvementRate: 'DOM 수 99.9% 절감',
    tags: ['가상화', 'TanStack Virtual', 'DOM 트리', '프레임'],
    report: {
      before:
        '실무 거래 내역 리스트 페이지에서 10,000건 이상의 렌더링 항목을 단순 배열 매핑으로 전부 DOM 트리에 추가했더니, 브라우저 메모리가 450MB까지 치솟고 스크롤할 때마다 극심한 프레임 저하가 유발됨.',
      cause:
        '화면에 보이지 않는 영역의 무수한 DOM 요소들까지 브라우저 레이아웃 엔진이 스타일 재계산과 그리기 연산을 수행함.',
      appliedTech:
        '1. TanStack Virtual 윈도잉 기술 적용\n2. 화면 뷰포트 영역 내부의 10~15개 DOM 노드만 실시간 계산하여 렌더링 유지',
      result: 'DOM 노드 수가 100,000개에서 15개로 99.9% 감소, 스크롤 프레임 60 FPS 회복.',
      retrospective:
        '화면에 10만 개 아이템이 있다고해서 브라우저한테 10만 개 태그를 다 그리라고 하면 폰이 지쳐서 멈춰버립니다. 유저 눈에 보이는 딱 10개만 남겨두고 스크롤할 때마다 바꿔치기해주니 렉이 거짓말처럼 싹 사라졌습니다.',
    },
    codeSnippet: {
      beforeCode: `// ❌ 개선 전: 100,000개 전체 아이템을 직접 DOM으로 생성 (450MB 메모리 차지, 스크롤 렉)
export function SlowList({ items }) {
  return (
    <div className="h-[400px] overflow-y-auto">
      {items.map((item) => (
        <div key={item.id} className="h-12 border-b">
          {item.name} - {item.price}
        </div>
      ))}
    </div>
  );
}`,
      afterCode: `// ✅ 개선 후: TanStack Virtual을 활용한 가상 스크롤 (뷰포트 15개 노드만 DOM 유지)
import { useVirtualizer } from '@tanstack/react-virtual';

export function FastVirtualList({ items }) {
  const parentRef = useRef(null);
  const rowVirtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 48,
  });

  return (
    <div ref={parentRef} className="h-[400px] overflow-y-auto">
      <div style={{ height: \`\${rowVirtualizer.getTotalSize()}px\`, position: 'relative' }}>
        {rowVirtualizer.getVirtualItems().map((virtualRow) => (
          <div
            key={virtualRow.key}
            style={{
              position: 'absolute',
              top: 0,
              transform: \`translateY(\${virtualRow.start}px)\`,
            }}
          >
            {items[virtualRow.index].name}
          </div>
        ))}
      </div>
    </div>
  );
}`,
    },
  },
  {
    id: 'search',
    slug: 'search',
    number: 6,
    title: 'Search Optimization',
    titleKo: '실시간 검색 디바운싱 및 캐싱',
    category: '네트워크 및 UX',
    description:
      '검색어 입력 시마다 API 요청이 20~30회 연속 폭주하여 백엔드 서버가 과부하되고 레이스 조건이 발생하는 문제를 디바운스와 캐싱으로 방지합니다.',
    beforeStats: { label: 'API 요청 횟수', value: '28 회' },
    afterStats: { label: 'API 요청 횟수', value: '2 회' },
    improvementRate: '-92.8%',
    tags: ['디바운스', 'TanStack Query', '캐싱', '사전 로딩'],
    report: {
      before:
        '자동완성 검색창에 단어를 빠르게 입력할 때 글자 하나마다 API 요청이 발송되어 11번의 불필요한 서버 트래픽이 발생하고, 늦게 도착한 API 응답이 이전 결과를 덮어쓰는 레이스 조건 현상 발생.',
      cause: '입력 이벤트 핸들러에서 제어 로직 없이 요청 함수를 즉시 실행.',
      appliedTech:
        '1. 입력 타이핑이 멈춘 후 300ms 뒤 단 1회 요청하는 디바운스 패턴 적용\n2. TanStack Query 캐싱으로 동일 검색어 즉시 반환\n3. 마우스 호버 시 사전 데이터를 가져오는 사전 로딩 결합',
      result: '입력 시 28회 발생하던 API 요청이 2회로 92.8% 감소.',
      retrospective:
        '검색창에 한 글자 칠 때마다 서버로 요청을 보내면 서버도 뻗고 화면도 지저분해집니다. 사용자가 손을 멈췄을 때 타임아웃을 주고 단 한 번만 요청을 보내도록 조율해 주니 네트워크도 깔끔해지고 반응 속도도 훨씬 안정적이었습니다.',
    },
    codeSnippet: {
      beforeCode: `// ❌ 개선 전: 입력 마다 API 즉시 호출 (글자 하나마다 요청 폭주 및 레이스 조건)
export function SearchInput() {
  const handleChange = (e) => {
    // 글자 입력 시마다 매번 API 요청 발송
    fetch(\`/api/search?q=\${e.target.value}\`);
  };
  return <input onChange={handleChange} />;
}`,
      afterCode: `// ✅ 개선 후: 300ms 디바운스 및 TanStack Query 캐싱 적용
import { useQuery } from '@tanstack/react-query';

export function SearchInput() {
  const [keyword, setKeyword] = useState('');
  const [debouncedKeyword, setDebouncedKeyword] = useState('');

  // 1. 300ms 타이핑 멈춤 감지 디바운스
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedKeyword(keyword), 300);
    return () => clearTimeout(timer);
  }, [keyword]);

  // 2. 캐시 및 자동으로 중복 요청을 방지하는 쿼리
  const { data } = useQuery({
    queryKey: ['search', debouncedKeyword],
    queryFn: () => fetchSearch(debouncedKeyword),
    enabled: !!debouncedKeyword,
    staleTime: 1000 * 60 * 5, // 5분 캐시 유지
  });

  return <input value={keyword} onChange={(e) => setKeyword(e.target.value)} />;
}`,
    },
  },
  {
    id: 'network',
    slug: 'network',
    number: 7,
    title: 'Network Optimization & Cache',
    titleKo: '낙관적 업데이트',
    category: '네트워크 및 UX',
    description:
      '좋아요나 장바구니 담기 버튼 클릭 시 서버 응답 850ms 동안 UI가 먹통이 되어 유저가 버튼이 안 눌린 줄 알고 연타하는 문제를 낙관적 업데이트로 0ms 즉각 반응하도록 개선합니다.',
    beforeStats: { label: 'UI 체감 반응 지연', value: '850 ms' },
    afterStats: { label: 'UI 체감 반응 지연', value: '0 ms' },
    improvementRate: '즉시 반환 (0ms)',
    tags: ['낙관적 업데이트', '캐시 유지', '재시도 정책'],
    report: {
      before:
        '피드 상의 좋아요 버튼을 누를 때, 네트워크 지연 동안 UI 반응이 전혀 없어 사용자가 미작동으로 착각해 연타를 누르거나 화면을 새로고침하는 현상 발생.',
      cause:
        '서버 API 요청 성공 콜백이 도착한 이후에만 클라이언트 UI 상태를 갱신하는 보수적 비동기 패턴.',
      appliedTech:
        '1. TanStack Query를 통한 낙관적 업데이트 적용\n2. 요청 발송 즉시 클라이언트 상태를 성공으로 가정하고 즉시 UI 갱신\n3. 에러 발생 시 이전 상태로 자동 롤백',
      result: '사용자가 체감하는 버튼 반응 지연 시간이 850ms에서 0ms로 대폭 단축.',
      retrospective:
        '좋아요 버튼 누르고 서버 응답이 올 때까지 1초 동안 아무 반응이 없으면 유저는 고장 난 줄 알고 계속 누르게 됩니다. 일단 화면 하트부터 빨갛게 바꿔주고 백그라운드에서 조용히 통신하니 유저 입장에서 속도가 엄청 빠르게 느껴졌습니다.',
    },
    codeSnippet: {
      beforeCode: `// ❌ 개선 전: 서버 응답(850ms)이 끝날 때까지 UI가 반응하지 않아 답답한 경험 제공
const mutation = useMutation({
  mutationFn: toggleLikeApi,
  onSuccess: () => {
    // 850ms 지연 후 성공해야만 반응!
    setIsLiked(prev => !prev);
  }
});`,
      afterCode: `// ✅ 개선 후: 낙관적 업데이트 - 0ms 즉시 화면 반영 후 에러 시 자동 롤백
const mutation = useMutation({
  mutationFn: toggleLikeApi,
  onMutate: async (newLikeState) => {
    await queryClient.cancelQueries({ queryKey: ['likeState'] });
    const previousState = queryClient.getQueryData(['likeState']);
    
    // 1. 서버 응답을 기다리지 않고 UI 0ms 즉시 변경!
    queryClient.setQueryData(['likeState'], newLikeState);
    return { previousState };
  },
  onError: (err, newLikeState, context) => {
    // 2. 서버 에러 발생 시 원래 이전 상태로 자동 롤백
    queryClient.setQueryData(['likeState'], context.previousState);
  }
});`,
    },
  },
  {
    id: 'skeleton',
    slug: 'skeleton',
    number: 8,
    title: 'Skeleton UI & CLS Elimination',
    titleKo: '스켈레톤 UI 및 시프트 방지',
    category: 'UX 및 웹 바이탈',
    description:
      '데이터 로딩 동안 단순 텍스트만 떠있다가 갑자기 큰 이미지가 튀어나오면서 하단 버튼 위치가 200px 튕겨 나가 잘못 클릭되는 문제를 스켈레톤 UI와 사전 공간 확보로 해결합니다.',
    beforeStats: { label: '레이아웃 밀림 지표', value: '0.28' },
    afterStats: { label: '레이아웃 밀림 지표', value: '0.00' },
    improvementRate: '밀림 현상 0 달성',
    tags: ['스켈레톤 UI', '시프트 방지', '비율 고정', '공간 확보'],
    report: {
      before:
        '결제 페이지 로딩 중 단순 텍스트 상태에서 뒤늦게 이미지 요소들이 그려지면서 하단의 결제하기 버튼 위치가 200px 하단으로 밀려 내려가, 유저가 의도치 않은 영역을 클릭하는 누적 레이아웃 이동 발생.',
      cause: '이미지 및 카드 콘텐츠 영역의 사전 높이 및 너비 미확보로 인한 DOM 리플로우 발생.',
      appliedTech:
        '1. 실제 콘텐츠 구조와 동일한 스켈레톤 UI 배치\n2. CSS aspect-ratio 및 최소 높이로 로딩 중에도 공간을 사전에 철저히 예약',
      result: '레이아웃 밀림 지표가 0.28에서 0.00으로 완전 억제되어 감점 오명 극복.',
      retrospective:
        '로딩 중에 빙글빙글 도는 스피너만 보여주면 데이터가 들어올 때 화면 내용이 밑으로 덜컥 밀려나서 짜증이 납니다. 미리 들어올 자리에 뼈대(Skeleton) 박스를 세워두니까 화면 흔들림도 없고 깔끔해서 유저 경험이 훨씬 좋아집니다.',
    },
    codeSnippet: {
      beforeCode: `// ❌ 개선 전: 로딩 중 단순 텍스트 렌더링 - 데이터 수신 시 하단 요소 200px 덜컥 튐
export function ProductCard({ isLoading, data }) {
  if (isLoading) return <div>로딩 중...</div>; // 높이 확보 안 됨!

  return (
    <div>
      <img src={data.imgUrl} className="w-full h-64" />
      <h3>{data.title}</h3>
    </div>
  );
}`,
      afterCode: `// ✅ 개선 후: 스켈레톤 UI 및 비율 고정으로 고정 영역 확보 (밀림 현상 완벽 방지)
export function ProductCard({ isLoading, data }) {
  if (isLoading) {
    return (
      <div className="w-full space-y-3 animate-pulse">
        {/* 이미지가 들어올 자리를 미리 aspect-square로 정확히 차지 */}
        <div className="w-full aspect-square bg-neutral-200 rounded-lg" />
        <div className="w-3/4 h-4 bg-neutral-200 rounded" />
      </div>
    );
  }

  return (
    <div>
      <img src={data.imgUrl} className="w-full aspect-square object-cover" />
      <h3>{data.title}</h3>
    </div>
  );
}`,
    },
  },
  {
    id: 'memory-leak',
    slug: 'memory-leak',
    number: 9,
    title: 'Memory Leak Detection & Cleanup',
    titleKo: '메모리 누수 원인 분석 및 해제',
    category: '메모리 관리',
    description:
      '모달이나 페이지를 열었다가 닫아도 배경에서 타이머와 이벤트 리스너가 계속 살아남아 메모리가 185MB까지 누수되고 앱이 튕기는 문제를 정리 함수로 해결합니다.',
    beforeStats: { label: '누적 유지 메모리', value: '185 MB' },
    afterStats: { label: '누적 유지 메모리', value: '14 MB' },
    improvementRate: '누수 메모리 92% 해제',
    tags: ['메모리 누수', '정리 함수', '이벤트 리스너', '힙 스냅샷'],
    report: {
      before:
        '실시간 차트 모달을 열었다 닫을 때마다 배경에서 setInterval 타이머와 이벤트 리스너가 계속 누적되어, 앱을 오래 켜둘 시 메모리가 185MB로 솟구치며 브라우저 탭 튕김 현상 발생.',
      cause:
        'useEffect 내에서 등록한 타이머 및 이벤트를 컴포넌트 언마운트 시점에 해제하는 리턴 함수를 누락함.',
      appliedTech:
        '1. 개발자 도구 힙 스냅샷 분석으로 메모리 누수 포착\n2. useEffect 리턴 함수에 clearInterval, removeEventListener 명시적 작성',
      result: '페이지 전환 및 모달 닫기 시 메모리가 185MB에서 14MB로 즉각 정상 회수.',
      retrospective:
        '화면을 닫았는데도 뒤에서 타이머나 이벤트 리스너가 혼자 뱅뱅 돌고 있으면 스마트폰이 뜨거워지고 앱이 느려집니다. 컴포넌트가 사라질 때 깔끔하게 치워주는(cleanup) 습관이 얼마나 중요한지 제대로 깨달았습니다.',
    },
    codeSnippet: {
      beforeCode: `// ❌ 개선 전: useEffect 해제 리턴 함수 누락 (모달을 닫아도 타이머와 리스너가 메모리에 남아있음)
useEffect(() => {
  const timer = setInterval(() => {
    fetchLiveStockData();
  }, 1000);

  window.addEventListener('resize', handleResize);
  // 정리 함수 미작성으로 메모리 솟구침!
}, []);`,
      afterCode: `// ✅ 개선 후: 명시적 정리 리턴 구문 작성 (언마운트 시 즉각 메모리 해제)
useEffect(() => {
  const timer = setInterval(() => {
    fetchLiveStockData();
  }, 1000);

  const handleResize = () => { ... };
  window.addEventListener('resize', handleResize);

  // 컴포넌트 언마운트 시 즉각 가비지 컬렉터 대상으로 회수
  return () => {
    clearInterval(timer);
    window.removeEventListener('resize', handleResize);
  };
}, []);`,
    },
  },
  {
    id: 'accessibility',
    slug: 'accessibility',
    number: 10,
    title: 'Accessibility & Web Vitals 100',
    titleKo: '접근성 및 라이트하우스 100점',
    category: '접근성 및 품질',
    description:
      'div 태그로 버튼을 만들고 alt 속성을 누락하여 스크린 리더 유저나 키보드 탐색 유저의 접근이 차단되는 문제를 시맨틱 HTML과 ARIA, 포커스 트랩으로 해결합니다.',
    beforeStats: { label: '라이트하우스 접근성 점수', value: '58 점' },
    afterStats: { label: '라이트하우스 접근성 점수', value: '100 점' },
    improvementRate: '100점 만점 달성',
    tags: ['접근성', '시맨틱 HTML', 'ARIA', '포커스 트랩', '라이트하우스'],
    report: {
      before:
        '주요 대화형 UI가 div 클릭 형태로 구현되어 키보드 Tab 키 탐색이 불가능하고, 이미지 alt 태그 누락으로 보조공학 기술 사용자의 서비스 이용이 차단되며 라이트하우스 58점 기록.',
      cause:
        '스크린 리더의 DOM 접근성 트리를 고려하지 않은 비시맨틱 태그 사용 및 포커스 관리 누락.',
      appliedTech:
        '1. div 클릭 요소를 표준 button 및 시맨틱 태그로 완전 전환\n2. aria-label, aria-expanded 대화형 속성 추가\n3. 모달 포커스 트랩 적용',
      result: '라이트하우스 접근성 점수 58점에서 100점 만점 달성.',
      retrospective:
        '그냥 겉모습만 버튼처럼 만든 div 태그는 키보드나 시각장애인용 읽기 프로그램이 전혀 알아채지 못합니다. 시맨틱 태그와 accessibility 속성을 제대로 챙겨주는 게 단순히 점수 높이는 걸 넘어 모두를 위한 웹을 만드는 기본이라는 걸 느꼈습니다.',
    },
    codeSnippet: {
      beforeCode: `// ❌ 개선 전: 비시맨틱 div 버튼 (키보드 Tab 탐색 불가, 스크린 리더 인식 안 됨, 접근성 58점)
export function SubmitButton() {
  return (
    <div className="btn" onClick={handleSubmit}>
      <img src="/icon.png" /> {/* alt 누락 */}
      전송하기
    </div>
  );
}`,
      afterCode: `// ✅ 개선 후: 시맨틱 HTML, ARIA, 포커스 링 적용 (라이트하우스 100점 달성)
export function SubmitButton() {
  return (
    <button
      type="button"
      onClick={handleSubmit}
      aria-label="데이터 전송하기"
      className="focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <img src="/icon.png" alt="전송 아이콘" />
      <span>전송하기</span>
    </button>
  );
}`,
    },
  },
  {
    id: 'context-splitting',
    slug: 'context-splitting',
    number: 11,
    title: 'React Context Splitting',
    titleKo: 'React Context 분리 최적화',
    category: 'React 렌더링 최적화',
    description:
      '사용자 정보가 변경될 때마다 하나의 거대한 Context를 구독하는 모든 컴포넌트가 함께 리렌더링되어 화면 전체가 느려지는 문제를 Context 분리와 Selector 패턴으로 개선합니다.',
    beforeStats: { label: '전체 렌더링 노드 수', value: '180 개' },
    afterStats: { label: '전체 렌더링 노드 수', value: '2 개' },
    improvementRate: '-98.8%',
    tags: ['Context Splitting', 'Selector', '상태 분리', 'React.memo'],
    report: {
      before:
        '유저의 프로필 이름이나 테마 단 하나만 변경되어도 사용자 데이터, 결제 상태, 설정 정보가 하나로 뭉쳐진 거대한 Single Context 때문에 페이지 내 180개 컴포넌트가 동시 재렌더링됨.',
      cause:
        'Context Provider value 객체에 모든 상태와 핸들러를 묶어서 전달함으로 인해, 불필요한 관전 컴포넌트까지 useContext 수동 갱신 대상에 포함됨.',
      appliedTech:
        '1. UserStateContext와 UserDispatchContext를 물리적으로 분리\n2. ThemeContext 및 SettingsContext 독립 주입\n3. Selector 기반 커스텀 훅 작성',
      result: '이름 변경 시 연관된 2개 컴포넌트만 렌더링되어 재렌더링 98.8% 감축.',
      retrospective:
        '하나의 큰 컨텍스트에 모든 상태를 짬뽕해서 넣어두면 조그만 변경에도 전체 화면이 들썩입니다. 자주 바뀌는 상태와 안 바뀌는 상태를 따로 분리해주니 불필요하게 다시 그려지는 일이 확 줄어들었습니다.',
    },
    codeSnippet: {
      beforeCode: `// ❌ 개선 전: 거대 단일 Context - 사용자 이름 수정 시 전체 앱 컴포넌트 재렌더링
const HugeContext = createContext();

export function Provider({ children }) {
  const [user, setUser] = useState({ name: 'A', theme: 'dark', cart: [] });
  return <HugeContext.Provider value={{ user, setUser }}>{children}</HugeContext.Provider>;
}`,
      afterCode: `// ✅ 개선 후: Context 분리 및 상태-디스패치 분리 패턴
const UserStateContext = createContext();
const UserDispatchContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState({ name: 'A' });
  return (
    <UserStateContext.Provider value={user}>
      <UserDispatchContext.Provider value={setUser}>
        {children}
      </UserDispatchContext.Provider>
    </UserStateContext.Provider>
  );
}`,
    },
  },
  {
    id: 'tanstack-query-cache',
    slug: 'tanstack-query-cache',
    number: 12,
    title: 'TanStack Query Cache Strategy',
    titleKo: 'TanStack Query 캐싱 전략',
    category: '네트워크 & 데이터 캐싱',
    description:
      '동일한 페이지를 이동할 때마다 동일한 API를 반복 호출하여 로딩이 발생하는 문제를 staleTime, gcTime, prefetch를 활용한 캐싱 전략으로 개선합니다.',
    beforeStats: { label: '반복 API 요청 횟수', value: '15 회' },
    afterStats: { label: '반복 API 요청 횟수', value: '1 회 (캐시 사용)' },
    improvementRate: '네트워크 요청 93% 절감',
    tags: ['staleTime', 'gcTime', 'prefetchQuery', 'TanStack Query'],
    report: {
      before:
        '유저가 대시보드와 상세 페이지를 재방문할 때마다 동일한 회원 API 및 설정 API를 매번 네트워크로 재요청하여 1.2초 로딩 스피너가 반복 노출됨.',
      cause:
        '기본 staleTime이 0으로 설정되어 있어 컴포넌트 마운트 시마다 쿼리가 즉시 stale 상태로 판단되어 네트워크 재요청을 유발함.',
      appliedTech:
        '1. 데이터 변경 주기에 맞춰 staleTime: 5분, gcTime: 30분 설정\n2. 링크 마우스 호버 시 queryClient.prefetchQuery 수행으로 미리 로드',
      result: '동일 데이터 재방문 시 네트워크 요청이 15회에서 1회로 감소하고 즉시 0ms 렌더링.',
      retrospective:
        '사용자가 이전에 봤던 페이지로 돌아갔을 때 매번 로딩 스피너를 보여주는 건 꽤 답답합니다. 캐싱을 적용해 두니 이전에 가져온 데이터를 0초 만에 보여주고 뒤에서 최신화해 주니까 앱이 확실히 부드러워졌습니다.',
    },
    codeSnippet: {
      beforeCode: `// ❌ 개선 전: staleTime 미설정 (0ms) - 페이지 진입 시마다 동일 API 중복 재요청
const { data } = useQuery({
  queryKey: ['userProfile'],
  queryFn: fetchUserProfile,
});`,
      afterCode: `// ✅ 개선 후: staleTime, gcTime 및 Prefetch 사전 캐싱 적용 (0ms 캐시 서빙)
const { data } = useQuery({
  queryKey: ['userProfile'],
  queryFn: fetchUserProfile,
  staleTime: 1000 * 60 * 5, // 5분 동안 신선한 데이터로 간주 (재요청 0)
  gcTime: 1000 * 60 * 30,    // 30분 동안 인메모리 캐시 보존
});`,
    },
  },
  {
    id: 'websocket-batching',
    slug: 'websocket-batching',
    number: 13,
    title: 'WebSocket Render Throttle',
    titleKo: 'WebSocket 불필요한 렌더링 방지',
    category: '실시간 데이터 렌더링',
    description:
      '실시간 시세나 채팅 데이터가 초당 수십 번 들어오면서 화면 전체가 반복 렌더링되는 문제를 상태 분리와 배치 업데이트로 개선합니다.',
    beforeStats: { label: '초당 리렌더링 횟수', value: '45 회 / sec' },
    afterStats: { label: '초당 리렌더링 횟수', value: '2 회 / sec' },
    improvementRate: '렌더링 폭주 95.5% 억제',
    tags: ['WebSocket', 'Throttling', 'Batching', 'useRef 버퍼'],
    report: {
      before:
        '가상자산/주식 실시간 체결가 웹소켓 수신 시 초당 40~50회의 Message 이벤트가 유입되어 `setState`가 폭주하며 브라우저 탭 렉 현상 발생.',
      cause: '소켓 메시지 수신 이벤트 핸들러 직후 즉시 React State 갱신 함수를 일대일 호출.',
      appliedTech:
        '1. useRef 버퍼 큐에 수신 데이터 임시 누적\n2. 500ms 단위 쓰로틀링 및 requestAnimationFrame 기반 배치 렌더링 업데이트',
      result: '초당 45회에 달하던 렌더링 프레임 폭주를 초당 2회 안전한 프레임으로 억제.',
      retrospective:
        '초당 수십 번씩 쏟아지는 실시간 데이터를 매번 화면에 그려대면 브라우저가 버티지 못합니다. 잠깐 큐(Ref)에 모아뒀다가 0.5초마다 묶어서 화면을 갱신해주니 렉 없이 아주 매끄럽게 돌아갔습니다.',
    },
    codeSnippet: {
      beforeCode: `// ❌ 개선 전: 웹소켓 메시지 수신 때마다 setState 즉시 실행 (초당 45회 렌더링 렉)
socket.onmessage = (event) => {
  const data = JSON.parse(event.data);
  setStockPrices((prev) => [...prev, data]); // 초당 45회 상태 갱신!
};`,
      afterCode: `// ✅ 개선 후: useRef 버퍼링 및 500ms 배치 렌더링 (초당 2회로 상한선 통제)
const bufferRef = useRef([]);

socket.onmessage = (event) => {
  bufferRef.current.push(JSON.parse(event.data)); // 1. 버퍼에 임시 저장
};

useEffect(() => {
  const interval = setInterval(() => {
    if (bufferRef.current.length > 0) {
      setStockPrices((prev) => [...prev, ...bufferRef.current]); // 2. 500ms 마다 묶어서 1회 업데이트
      bufferRef.current = [];
    }
  }, 500);
  return () => clearInterval(interval);
}, []);`,
    },
  },
  {
    id: 'infinite-scroll',
    slug: 'infinite-scroll',
    number: 14,
    title: 'Infinite Scroll Optimization',
    titleKo: 'Infinite Scroll 최적화',
    category: '네트워크 & 스크롤 UI',
    description:
      '스크롤 이벤트마다 API 요청이 발생하거나 중복 호출되어 네트워크 낭비와 끊김 현상이 발생하는 문제를 Intersection Observer 기반으로 개선합니다.',
    beforeStats: { label: '중복/불필요 API 호출', value: '18 회' },
    afterStats: { label: '중복/불필요 API 호출', value: '0 회' },
    improvementRate: '중복 요청 100% 차단',
    tags: ['Intersection Observer', 'Infinite Scroll', '중복 요청 방지', 'TanStack Query'],
    report: {
      before:
        '무한 스크롤 구현 시 window scroll 이벤트를 구독하여 스크롤 위치를 동기 계산했더니, 스크롤을 훑을 때 동일한 페이지 offset API가 중복으로 4~5번 연속 호출되어 동일 데이터가 중복 렌더링됨.',
      cause:
        '스크롤 이벤트의 고주파 발생과 이전 API 요청 진행 중(isFetching) 여부 플래그 체크 누락.',
      appliedTech:
        '1. Intersection Observer API를 활용하여 하단 관찰 픽셀 전용 Sentinel 요소 배치\n2. hasNextPage 및 isFetchingNextPage 상태 락(Lock) 추가',
      result: '스크롤 시 중복 API 요청이 100% 차단되며 부드러운 60fps 무한 스크롤 완성.',
      retrospective:
        '스크롤 이벤트만 믿고 계속 감지하면 순식간에 중복 데이터 요청이 무더기로 날아갑니다. 화면 끝에 다다랐을 때만 딱 인식하는 감지기와 중복 요청 방지 락(Lock)을 걸어두니 안정적으로 리스트가 계속 이어졌습니다.',
    },
    codeSnippet: {
      beforeCode: `// ❌ 개선 전: scroll 이벤트 동기 추적 (중복 요청 폭주 및 메인 스레드 과부하)
window.addEventListener('scroll', () => {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 200) {
    fetchNextPage(); // 중복 호출 플래그 없이 연속 발사!
  }
});`,
      afterCode: `// ✅ 개선 후: Intersection Observer 타겟 감지 & fetching 락(Lock) 적용
const { observerRef } = useInfiniteScroll({
  hasNextPage,
  isFetchingNextPage,
  onLoadMore: fetchNextPage,
});

return (
  <div>
    {items.map(item => <Card key={item.id} data={item} />)}
    <div ref={observerRef} className="h-10" /> {/* 센티널 타겟 */}
  </div>
);`,
    },
  },
  {
    id: 'layout-thrashing',
    slug: 'layout-thrashing',
    number: 15,
    title: 'Layout Thrashing Elimination',
    titleKo: 'Layout Thrashing 제거',
    category: '브라우저 렌더링 엔진',
    description:
      'DOM 읽기와 쓰기가 반복되면서 브라우저가 강제로 Layout을 여러 번 계산하여 애니메이션이 끊기는 문제를 Batch 처리와 Transform 기반 렌더링으로 해결합니다.',
    beforeStats: { label: '강제 레이아웃(Reflow) 횟수', value: '50 회 / frame' },
    afterStats: { label: '강제 레이아웃(Reflow) 횟수', value: '0 회' },
    improvementRate: '강제 Reflow 100% 제거',
    tags: ['Layout Thrashing', 'Reflow', 'DOM Batching', 'FastDOM'],
    report: {
      before:
        '여러 카드 엘리먼트의 높이를 동적으로 읽어서 설정하는 루프(`element.offsetHeight` ➔ `element.style.height = ...`)에서 브라우저가 매 루프마다 레이아웃 재계산(Forced Synchronous Layout)을 수행하여 애니메이션 프레임이 뚝뚝 끊김.',
      cause:
        'DOM Read 연산과 DOM Write 연산을 인터리빙(Interleaving) 교대로 반복하여 브라우저 동기 리플로우 발생.',
      appliedTech:
        '1. DOM Read 파트와 DOM Write 파트를 분리하여 Batch 모아 쳐리\n2. 위치 이동 시 top/left 대신 GPU가 처리하는 transform: translate3d 사용',
      result: '프레임당 50회 유발되던 강제 레이아웃(Reflow) 횟수를 0회로 제거.',
      retrospective:
        '브라우저에게 높이 물어보고(Read) 바로 스타일 바꾸고(Write)를 반복시키면 엄청 지쳐합니다. 읽는 작업부터 한꺼번에 다 한 다음에 스타일 수정을 모아서 해주니 렌더링 프레임이 눈에 띄게 부드러워졌습니다.',
    },
    codeSnippet: {
      beforeCode: `// ❌ 개선 전: Layout Thrashing 유발 (Read와 Write를 매 루프마다 교대로 실행)
elements.forEach((el) => {
  const width = el.offsetWidth; // 1. Read (레이아웃 강제 재계산!)
  el.style.width = \`\${width + 10}px\`; // 2. Write (Style 무효화)
});`,
      afterCode: `// ✅ 개선 후: Read와 Write 연산 분리 Batch 처리 (강제 Reflow 0회)
// 1. Read 연산을 먼저 전량 수행하여 메모리에 수집
const widths = elements.map((el) => el.offsetWidth);

// 2. Write 연산을 한꺼번에 묶어서 렌더링 처리
elements.forEach((el, index) => {
  el.style.width = \`\${widths[index] + 10}px\`;
});`,
    },
  },
  {
    id: 'css-animation-gpu',
    slug: 'css-animation-gpu',
    number: 16,
    title: 'GPU Accelerated CSS Animation',
    titleKo: 'CSS 애니메이션 성능 비교',
    category: 'CSS & GPU 가속',
    description:
      'top, left 속성으로 애니메이션을 구현하여 매 프레임 Reflow가 발생하는 문제를 transform과 opacity 기반 GPU 가속으로 개선합니다.',
    beforeStats: { label: '렌더링 레이어 파이프라인', value: 'Layout + Paint + Composite' },
    afterStats: { label: '렌더링 레이어 파이프라인', value: 'Composite Only (GPU)' },
    improvementRate: 'CPU 메인스레드 차단 0',
    tags: ['GPU 가속', 'transform3d', 'opacity', 'will-change', 'Reflow 방지'],
    report: {
      before:
        '슬라이드 메뉴 및 툴팁 이동 애니메이션에 CSS top, left, margin 속성을 사용했더니 애니메이션 동작 시 메인 스레드 CPU 점유율이 90%까지 치솟고 뚝뚝 끊김 현상 발생.',
      cause:
        'top, left 속성 변경은 렌더링 파이프라인의 Layout(Reflow) 단계부터 Paint까지 전체 재계산을 매 프레임 유발함.',
      appliedTech:
        '1. top/left 위치 변경을 `transform: translate3d()`로 교체\n2. 투명도 변화 시 display/visibility 대신 `opacity` 사용\n3. GPU 하드웨어 가속 레이어 생성(will-change)',
      result:
        'Layout 및 Paint 단계를 스킵하고 GPU Composite 단계만 수행하여 60fps 부드러운 전환 완성.',
      retrospective:
        'top이나 left 위치값으로 애니메이션을 만들면 브라우저 CPU가 힘들어서 버벅거립니다. transform과 opacity처럼 GPU 그래픽 카드가 직접 처리하는 속성을 써주니까 60프레임으로 아주 부드럽게 움직였습니다.',
    },
    codeSnippet: {
      beforeCode: `/* ❌ 개선 전: top/left 기반 애니메이션 (매 프레임 Reflow 및 Paint 연산 발생) */
.slide-menu {
  position: absolute;
  left: 0px;
  transition: left 0.3s ease; /* Reflow 유발! */
}
.slide-menu.active {
  left: 300px;
}`,
      afterCode: `/* ✅ 개선 후: transform 3D 기반 GPU 가속 애니메이션 (Reflow/Paint 0회) */
.slide-menu {
  transform: translate3d(0, 0, 0);
  will-change: transform;
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.slide-menu.active {
  transform: translate3d(300px, 0, 0); /* GPU Composite 단에서 전담 처리! */
}`,
    },
  },
  {
    id: 'font-cls-optimization',
    slug: 'font-cls-optimization',
    number: 17,
    title: 'Font Optimization & CLS',
    titleKo: '폰트 최적화 및 CLS 개선',
    category: '웹 폰트 & Web Vitals',
    description:
      '웹폰트 로딩이 늦어 텍스트가 갑자기 변경되면서 Layout Shift가 발생하는 문제를 font-display와 preload 전략으로 개선합니다.',
    beforeStats: { label: 'FOUT/FOIT 레이아웃 이동', value: '0.19 (시프트 발생)' },
    afterStats: { label: 'FOUT/FOIT 레이아웃 이동', value: '0.00 (이동 제로)' },
    improvementRate: '폰트 CLS 0점 통과',
    tags: ['font-display', 'preload', 'WOFF2', 'FOUT/FOIT', 'Pretendard'],
    report: {
      before:
        '웹폰트 다운로드가 늦어 초기엔 시스템 폰트로 렌더링되었다가 1.5초 후 커스텀 웹폰트로 변경되면서 글자 줄바꿈과 줄높이가 바뀌어 텍스트 레이아웃 이동(CLS) 유발.',
      cause:
        '웹폰트 파일의 느린 서빙과 fallback 폰트와의 폰트 메트릭(Font Metrics: ascent, descent) 불일치.',
      appliedTech:
        '1. WOFF2 서브셋 폰트 포맷 사용 및 `<link rel="preload">` 선점 다운로드\n2. `@font-face`에 `font-display: swap` 설정\n3. fallback 폰트에 size-adjust 사전 맞춤 설정',
      result: '폰트 로딩으로 인한 CLS 지표가 0.19에서 0.00으로 완전 억제.',
      retrospective:
        '웹폰트가 뒤늦게 다운로드되면서 갑자기 글자 폰트가 확 바뀌어 화면 텍스트 줄바꿈이 밀려나는 게 참 보기 싫었습니다. 폰트 용량을 줄이고 미리 불러오게(Preload) 설정하니 텍스트 밀림 현상이 깔끔하게 해결되었습니다.',
    },
    codeSnippet: {
      beforeCode: `/* ❌ 개선 전: 기본 폰트 로드 (FOIT 텍스트 안보임 현상 및 폰트 변경 시 레이아웃 튐) */
@font-face {
  font-family: 'CustomFont';
  src: url('/fonts/CustomFont.ttf'); /* 3MB 대용량 TTF */
}`,
      afterCode: `/* ✅ 개선 후: WOFF2 경량 포맷, font-display: swap 및 Preload 적용 */
/* HTML: <link rel="preload" href="/fonts/Pretendard.woff2" as="font" type="font/woff2" crossorigin /> */

@font-face {
  font-family: 'Pretendard';
  src: url('/fonts/Pretendard.woff2') format('woff2');
  font-display: swap; /* 텍스트 가독성 선확보 후 자연스러운 폰트 교체 */
  font-weight: 400 700;
}`,
    },
  },
  {
    id: 'api-waterfall-parallel',
    slug: 'api-waterfall-parallel',
    number: 18,
    title: 'Parallel API Requests & Waterfall Removal',
    titleKo: 'API 병렬 처리와 Waterfall 제거',
    category: '네트워크 아키텍처',
    description:
      '여러 API를 순차적으로 호출하여 첫 화면 렌더링이 지연되는 문제를 Promise.all과 병렬 요청으로 개선합니다.',
    beforeStats: { label: '총 API 워터폴 소요시간', value: '1,850 ms' },
    afterStats: { label: '총 API 워터폴 소요시간', value: '420 ms' },
    improvementRate: '-77.2%',
    tags: ['Promise.all', 'Waterfall 제거', '병렬 쿼리', 'useQueries'],
    report: {
      before:
        '대시보드 진입 시 유저 정보 ➔ 권한 정보 ➔ 통계 데이터를 직렬(Waterfall)순으로 하나씩 await 호출하여 총 API 로딩 시간이 1,850ms까지 길어짐.',
      cause:
        '독립적인 비동기 API 요청들 간에 상호 의존성이 없음에도 불구하고 순차적 await 동기 코드로 작성함.',
      appliedTech:
        '1. 독립적 API 호출을 `Promise.all()` 병렬 요청으로 포장\n2. TanStack Query의 `useQueries` 훅을 이용한 병렬 패칭 아키텍처 적용',
      result: 'API 응답 완료 총 시간이 1,850ms에서 가장 긴 1개 API 시간인 420ms로 77.2% 감축.',
      retrospective:
        '서로 상관없는 API 3개를 순서대로 하나 끝나면 다음 것 부르는 식으로 기다리게 만든 코드가 문제였습니다. Promise.all로 한꺼번에 동시 요청하니 전체 대기 시간이 3분의 1로 뚝 줄어들었습니다.',
    },
    codeSnippet: {
      beforeCode: `// ❌ 개선 전: 순차적 await 호출로 인한 워터폴 계단 현상 (총 1,850ms 지연)
const user = await fetchUser();         // 400ms 대기
const auth = await fetchAuth(user.id);   // 450ms 대기
const stats = await fetchStats();       // 1,000ms 대기! (합계 1,850ms)`,
      afterCode: `// ✅ 개선 후: Promise.all 및 useQueries 병렬 요청 (최대 소요시간 1,000ms 동시 처리)
const [user, auth, stats] = await Promise.all([
  fetchUser(),
  fetchAuth(),
  fetchStats(),
]);`,
    },
  },
  {
    id: 'script-loading-strategy',
    slug: 'script-loading-strategy',
    number: 19,
    title: 'Third-party Script Loading Strategy',
    titleKo: 'Script Loading 최적화',
    category: '서드파티 스크립트',
    description:
      'Analytics, Chat, 광고 스크립트가 초기 렌더링을 차단하여 FCP가 느려지는 문제를 async, defer, lazy loading 전략으로 개선합니다.',
    beforeStats: { label: '초기 렌더링 차단 (FCP)', value: '3.2 초' },
    afterStats: { label: '초기 렌더링 차단 (FCP)', value: '0.8 초' },
    improvementRate: '-75.0%',
    tags: ['next/script', 'lazyOnload', 'async/defer', 'FCP 개선'],
    report: {
      before:
        '구글 애널리틱스, 챗봇 상담 뷰, 외부 광고 SDK 등 5개의 서드파티 스크립트가 `<head>` 상단 동기 태그로 삽입되어, 스크립트 파싱으로 인해 FCP(First Contentful Paint)가 3.2초 지연됨.',
      cause: '동기적 `<script>` 태그가 브라우저의 HTML 파싱을 중단시키고 메인 스레드를 점유함.',
      appliedTech:
        '1. Next.js `next/script` 컴포넌트의 strategy 옵션 제어\n2. 챗봇 및 광고 스크립트는 `strategy="lazyOnload"`로 화면 로딩 완수 후 로드\n3. 필수 분석 스크립트는 `strategy="afterInteractive"` 적용',
      result: '초기 화면 FCP 속도가 3.2초에서 0.8초로 75% 대폭 단축.',
      retrospective:
        '외부 챗봇이나 분석용 스크립트를 상단에 그냥 넣어두면 내 사이트 화면이 다 뜰 때까지 브라우저가 멈춰 서서 기다립니다. 내 주요 화면부터 다 띄우고 뒤이어 가져오도록 순서를 조율해 주니 첫 화면이 확 빨라졌습니다.',
    },
    codeSnippet: {
      beforeCode: `<!-- ❌ 개선 전: head 상단 동기 스크립트 (HTML 파싱 중단 및 FCP 3.2초 지연) -->
<head>
  <script src="https://third-party-analytics.com/sdk.js"></script>
  <script src="https://heavy-chatbot.com/widget.js"></script>
</head>`,
      afterCode: `// ✅ 개선 후: Next.js Script 전략적 배치 (lazyOnload 및 afterInteractive)
import Script from 'next/script';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        {/* 인터랙션 완료 후 천천히 로드되는 서드파티 스크립트 */}
        <Script
          src="https://heavy-chatbot.com/widget.js"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}`,
    },
  },
  {
    id: 'suspense-streaming-ssr',
    slug: 'suspense-streaming-ssr',
    number: 20,
    title: 'React Suspense & Streaming SSR',
    titleKo: 'Suspense와 Streaming SSR 비교',
    category: '서버 렌더링 (RSC / SSR)',
    description:
      '모든 데이터를 받아야 화면이 렌더링되어 사용자가 긴 백화면을 보게 되는 문제를 React Suspense와 Streaming SSR을 활용하여 점진적으로 화면을 표시하도록 개선합니다.',
    beforeStats: { label: '첫 화면 TTFB / 백화면 시간', value: '2.4 초 (전체 대기)' },
    afterStats: { label: '첫 화면 TTFB / 백화면 시간', value: '120 ms (점진 스트리밍)' },
    improvementRate: 'TTFB 95% 단축',
    tags: ['React Suspense', 'Streaming SSR', 'RSC', '점진적 렌더링'],
    report: {
      before:
        '메인 피드, 추천 상품, 사용자 프로필을 서버에서 한꺼번에 준비하는 기존 SSR 방식에서 가장 느린 추천 상품 API(2.4초) 때문에 전체 페이지 응답이 2.4초 동안 멈춘 백화면으로 지연됨.',
      cause:
        '서버 측 렌더링이 전체 비동기 데이터 수집 완료 전까지 HTML 응답 스트림을 시작하지 못하는 블로킹 구조.',
      appliedTech:
        '1. React Suspense 경계(Boundary)로 독립적 비동기 컴포넌트 래핑\n2. Next.js App Router의 HTTP Streaming HTML 서빙을 통해 빠른 상단 셸(Shell) 먼저 전송',
      result: '첫 상단 화면 TTFB가 2.4초에서 120ms로 단축되며 사용자가 즉각 렌더링 셸을 확인.',
      retrospective:
        '서버에서 전체 화면 데이터가 다 준비될 때까지 유저에게 하얀 빈 화면만 보여주는 건 안 좋습니다. 빠른 부분부터 바로 흘려보내 주고(Streaming), 느린 부분만 로딩 표시로 보여주니 첫 화면 체감 속도가 엄청 좋아졌습니다.',
    },
    codeSnippet: {
      beforeCode: `// ❌ 개선 전: 기존 SSR - 모든 API(가장 느린 API 2.4초)가 완료될 때까지 전체 페이지 렌더링 블로킹
export async function getServerSideProps() {
  const feed = await fetchFeed();
  const slowRecommendations = await fetchSlowData(); // 2.4초 지연!
  return { props: { feed, slowRecommendations } };
}`,
      afterCode: `// ✅ 개선 후: React Suspense 및 Streaming SSR (상단 120ms 즉시 반환 + 느린 영역 스트리밍)
import { Suspense } from 'react';

export default function DashboardPage() {
  return (
    <div>
      {/* 1. 120ms 만에 상단 셸 즉시 서빙 */}
      <Header />
      <FastFeed />

      {/* 2. 느린 비동기 영역만 Suspense 스켈레톤 래핑 후 스트리밍 주입 */}
      <Suspense fallback={<SlowComponentSkeleton />}>
        <SlowRecommendations />
      </Suspense>
    </div>
  );
}`,
    },
  },
];
