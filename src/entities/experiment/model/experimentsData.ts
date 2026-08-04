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
      '실무 상황: 단일 상태 저장소나 부모 컴포넌트의 리렌더링으로 인해 수정되지 않은 하위 100여 개 컴포넌트까지 몽땅 재렌더링되며 화면 스크롤과 타이핑 반응 속도가 느려지는 문제를 최적화합니다.',
    beforeStats: { label: '렌더링 횟수', value: '142 회' },
    afterStats: { label: '렌더링 횟수', value: '12 회' },
    improvementRate: '-91.5%',
    tags: ['React.memo', 'useCallback', '상태 분리', 'Selector'],
    report: {
      before:
        '실무 사례: 쇼핑몰 장바구니 페이지에서 상품 수량을 하나 늘릴 때마다, 장바구니 상태 전체가 변경되면서 상단 프로필 헤더, 추천 상품 리스트, 배송비 계산기 등 독립된 140여 개 하위 컴포넌트가 전부 리렌더링되어 타이핑 딜레이가 발생함.',
      cause:
        'React Context API 기본 동작상 Provider의 value 객체에 새로운 참조값이 할당되면, useContext를 사용하는 모든 자식 컴포넌트가 무조건 전체 재렌더링됨. 또한 인라인 콜백 전달로 인해 메모이제이션이 무효화됨.',
      appliedTech:
        '1. 상태 컨텍스트와 디스패치 컨텍스트를 물리적으로 분리\n2. Zustand Selector 패턴으로 필요한 상태 조각만 구독\n3. 무거운 하위 컴포넌트에 React.memo 및 useCallback 적용하여 렌더링 스킵',
      result:
        '수량 변경 버튼 클릭 시 관련 컴포넌트 1개만 렌더링되어 총 렌더링 횟수가 142회에서 12회로 감소 (91.5% 개선).',
      retrospective:
        '상태 관리 라이브러리 선택 시 Selector 패턴 지원 여부와 컨텍스트 분리 설계가 리액트 앱의 반응 속도를 결정짓는 핵심 기둥임을 검증.',
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
      '실무 상황: 특정 모달에서만 쓰이는 대용량 차트 라이브러리와 에디터가 메인 번들에 통째로 포함되어 초기 페이지 접속 시 백화 현상이 지연되는 문제를 동적 임포트로 개선합니다.',
    beforeStats: { label: '초기 자바스크립트 크기', value: '2.8 MB' },
    afterStats: { label: '초기 자바스크립트 크기', value: '480 KB' },
    improvementRate: '-82.8%',
    tags: ['동적 임포트', '트리쉐이킹', '코드 스플리팅'],
    report: {
      before:
        "실무 사례: 어드민 대시보드 및 상세 페이지에서 '리포트 다운로드 모달' 내 차트 라이브러리와 리치 텍스트 에디터가 정적 import로 작성되어, 첫 접속 유저가 보지도 않는 2.3MB 분량의 코드를 초기에 다운로드받느라 로딩에 3초 이상 소요됨.",
      cause:
        '파일 상단의 정적 import 구문으로 인해 웹팩이 메인 bundle.js 번들에 포함시켜 자바스크립트 실행 전까지 렌더링이 차단됨 (총 차단 시간 증가).',
      appliedTech:
        '1. Next.js next/dynamic 모듈을 활용하여 해당 모달이 열리는 시점에 비동기 자바스크립트 로드\n2. 트리쉐이킹 지원 미흡 라이브러리를 lodash-es 등 ES Module 라이브러리로 대체',
      result:
        '초기 페이지 자바스크립트 다운로드 용량이 2.8MB에서 480KB로 82.8% 급감, 초기 렌더링 타임 대폭 단축.',
      retrospective:
        '사용자가 당장 눈으로 보지 않는 모달, 탭, 무거운 라이브러리는 무조건 동적 임포트 처리하는 개발 습관이 번들 다이어트의 핵심임을 확인.',
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
      '실무 상황: 디자이너가 전달한 5MB 원본 PNG 히어로 배너 이미지를 그대로 서빙하여 모바일 LCP 점수가 5.4초 지연되는 문제를 next/image 기반 최신 포맷 변환으로 해결합니다.',
    beforeStats: { label: 'LCP 이미지 표시 시간', value: '5.4 초' },
    afterStats: { label: 'LCP 이미지 표시 시간', value: '1.2 초' },
    improvementRate: '-77.7%',
    tags: ['next/image', 'WebP/AVIF', '지연 로딩', '블러 블레이스홀더'],
    report: {
      before:
        '실무 사례: 프로모션 메인 이벤트 페이지의 메인 히어로 배너 이미지가 5.2MB PNG 원본 그대로 img 태그로 서빙되어, 모바일 환경 유저의 LCP 속도가 5.4초로 측정되며 이탈률 상승.',
      cause:
        '이미지 포맷 압축 미적용, 반응형 뷰포트 크기 미대응, 뷰포트 밖 이미지의 조기 다운로드로 인한 네트워크 대역폭 병목.',
      appliedTech:
        '1. next/image로 자동 WebP/AVIF 압축 서빙 및 뷰포트별 srcset 반응형 변환\n2. LCP 대상인 최상단 히어로 이미지는 priority 속성 부여\n3. 하단 이미지는 지연 로딩 및 블러 플레이스홀더 적용',
      result:
        '이미지 패킷 크기가 5.2MB에서 140KB로 절감되며 LCP 타임이 5.4초에서 1.2초로 대폭 개선.',
      retrospective:
        'LCP 지표는 웹사이트 첫인상을 결정짓는 지표이며, 최신 포맷 적용과 priority 설정만으로도 드라마틱한 성능 향상이 가능함을 검증.',
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
      '실무 상황: 모든 데이터를 CSR 방식으로 불러와 첫 화면 백화 현상과 SEO 불이익을 겪는 문제를 페이지 특성에 맞춘 SSG/ISR/SSR 하이브리드 아키텍처로 개선합니다.',
    beforeStats: { label: 'CSR 응답 및 표시 시간', value: '1.8초 / 2.4초' },
    afterStats: { label: 'ISR 응답 및 표시 시간', value: '45ms / 0.3초' },
    improvementRate: '응답속도 97% 개선',
    tags: ['CSR', 'SSR', 'SSG', 'ISR'],
    report: {
      before:
        '실무 사례: 상품 상세 페이지를 순수 CSR로 구현했을 때, 검색 엔진 크롤러가 상품 정보를 수집하지 못해 SEO 검색 노출이 차단되고, 유저는 자바스크립트 로딩 후 API 응답까지 2.4초 동안 빈 화면을 지켜봐야 함.',
      cause:
        '클라이언트 측 브라우저 자바스크립트 다운로드 ➔ 파싱 ➔ API 요청 ➔ DOM 생성으로 이어지는 긴 비동기 렌더링 워터폴 구조.',
      appliedTech:
        '1. 정적 홍보 및 소개 페이지는 빌드 시점 생성을 위한 SSG 전략 적용\n2. 주기적 가격 갱신이 필요한 상품 페이지는 ISR 적용\n3. 유저 개인화 정보는 SSR 하이브리드 배치',
      result:
        'Edge CDN에서 즉시 응답하는 ISR 적용 페이지의 응답 시간이 1.8초에서 45ms로 대폭 단축.',
      retrospective:
        '페이지의 데이터 변경 주기와 SEO 요구사항에 맞춰 CSR/SSR/SSG/ISR을 정확히 선택하는 것이 서비스 아키텍처의 핵심임을 확인.',
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
      '실무 상황: 10,000개 이상의 상품 목록이나 로그 데이터를 무한 스크롤로 불러올 때 DOM 노드 수가 수만 개로 늘어나며 브라우저 스크롤 프레임이 14 FPS로 떨어지는 문제를 뷰포트 가상 스크롤로 해결합니다.',
    beforeStats: { label: 'DOM 노드 수 / 프레임', value: '10만개 / 14 FPS' },
    afterStats: { label: 'DOM 노드 수 / 프레임', value: '15개 / 60 FPS' },
    improvementRate: 'DOM 수 99.9% 절감',
    tags: ['가상화', 'TanStack Virtual', 'DOM 트리', '프레임'],
    report: {
      before:
        '실무 사례: 실무 거래 내역 리스트 페이지에서 10,000건 이상의 렌더링 항목을 단순 배열 매핑으로 전부 DOM 트리에 추가했더니, 브라우저 메모리가 450MB까지 치솟고 스크롤할 때마다 극심한 프레임 저하가 유발됨.',
      cause:
        '화면에 보이지 않는 영역의 무수한 DOM 요소들까지 브라우저 레이아웃 엔진이 스타일 재계산과 그리기 연산을 수행함.',
      appliedTech:
        '1. TanStack Virtual 윈도잉 기술 적용\n2. 화면 뷰포트 영역 내부의 10~15개 DOM 노드만 실시간 계산하여 렌더링 유지',
      result: 'DOM 노드 수가 100,000개에서 15개로 99.9% 감소, 스크롤 프레임 60 FPS 회복.',
      retrospective:
        '대용량 목록을 다룰 때 돔 트리 최소화는 단순 경험 개선을 넘어 브라우저 메모리 폭발을 막는 필수 안전장치임을 검증.',
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
      '실무 상황: 검색어 입력 시마다 API 요청이 20~30회 연속 폭주하여 백엔드 서버가 과부하되고 레이스 조건이 발생하는 문제를 디바운스와 캐싱으로 방지합니다.',
    beforeStats: { label: 'API 요청 횟수', value: '28 회' },
    afterStats: { label: 'API 요청 횟수', value: '2 회' },
    improvementRate: '-92.8%',
    tags: ['디바운스', 'TanStack Query', '캐싱', '사전 로딩'],
    report: {
      before:
        '실무 사례: 자동완성 검색창에 단어를 빠르게 입력할 때 글자 하나마다 API 요청이 발송되어 11번의 불필요한 서버 트래픽이 발생하고, 늦게 도착한 API 응답이 이전 결과를 덮어쓰는 레이스 조건 현상 발생.',
      cause: '입력 이벤트 핸들러에서 제어 로직 없이 요청 함수를 즉시 실행.',
      appliedTech:
        '1. 입력 타이핑이 멈춘 후 300ms 뒤 단 1회 요청하는 디바운스 패턴 적용\n2. TanStack Query 캐싱으로 동일 검색어 즉시 반환\n3. 마우스 호버 시 사전 데이터를 가져오는 사전 로딩 결합',
      result: '입력 시 28회 발생하던 API 요청이 2회로 92.8% 감소.',
      retrospective:
        '디바운스와 캐싱의 조합은 서버 트래픽 비용을 획기적으로 낮출 뿐만 아니라 사용자 검색 체감 속도를 몇 배 이상 올려줌을 입증.',
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
      '실무 상황: 좋아요나 장바구니 담기 버튼 클릭 시 서버 응답 850ms 동안 UI가 먹통이 되어 유저가 버튼이 안 눌린 줄 알고 연타하는 문제를 낙관적 업데이트로 0ms 즉각 반응하도록 개선합니다.',
    beforeStats: { label: 'UI 체감 반응 지연', value: '850 ms' },
    afterStats: { label: 'UI 체감 반응 지연', value: '0 ms' },
    improvementRate: '즉시 반환 (0ms)',
    tags: ['낙관적 업데이트', '캐시 유지', '재시도 정책'],
    report: {
      before:
        '실무 사례: 피드 상의 좋아요 버튼을 누를 때, 네트워크 지연 동안 UI 반응이 전혀 없어 사용자가 미작동으로 착각해 연타를 누르거나 화면을 새로고침하는 현상 발생.',
      cause:
        '서버 API 요청 성공 콜백이 도착한 이후에만 클라이언트 UI 상태를 갱신하는 보수적 비동기 패턴.',
      appliedTech:
        '1. TanStack Query를 통한 낙관적 업데이트 적용\n2. 요청 발송 즉시 클라이언트 상태를 성공으로 가정하고 즉시 UI 갱신\n3. 에러 발생 시 이전 상태로 자동 롤백',
      result: '사용자가 체감하는 버튼 반응 지연 시간이 850ms에서 0ms로 대폭 단축.',
      retrospective:
        '실제 네트워크 응답 속도를 바꿀 수 없다면, 소스코드 단에서 지연을 감추는 낙관적 업데이트 기법이 최고의 체감 성능을 만들어냄을 확인.',
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
      '실무 상황: 데이터 로딩 동안 단순 텍스트만 떠있다가 갑자기 큰 이미지가 튀어나오면서 하단 버튼 위치가 200px 튕겨 나가 잘못 클릭되는 문제를 스켈레톤 UI와 사전 공간 확보로 해결합니다.',
    beforeStats: { label: '레이아웃 밀림 지표', value: '0.28' },
    afterStats: { label: '레이아웃 밀림 지표', value: '0.00' },
    improvementRate: '밀림 현상 0 달성',
    tags: ['스켈레톤 UI', '시프트 방지', '비율 고정', '공간 확보'],
    report: {
      before:
        '실무 사례: 결제 페이지 로딩 중 단순 텍스트 상태에서 뒤늦게 이미지 요소들이 그려지면서 하단의 결제하기 버튼 위치가 200px 하단으로 밀려 내려가, 유저가 의도치 않은 영역을 클릭하는 누적 레이아웃 이동 발생.',
      cause: '이미지 및 카드 콘텐츠 영역의 사전 높이 및 너비 미확보로 인한 DOM 리플로우 발생.',
      appliedTech:
        '1. 실제 콘텐츠 구조와 동일한 스켈레톤 UI 배치\n2. CSS aspect-ratio 및 최소 높이로 로딩 중에도 공간을 사전에 철저히 예약',
      result: '레이아웃 밀림 지표가 0.28에서 0.00으로 완전 억제되어 감점 오명 극복.',
      retrospective:
        '스켈레톤 UI는 시각적 만족도 외에도 시점 이동 튐을 제로로 만들어주는 가장 강력한 웹 바이탈 안정성 솔루션임을 검증.',
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
      '실무 상황: 모달이나 페이지를 열었다가 닫아도 배경에서 타이머와 이벤트 리스너가 계속 살아남아 메모리가 185MB까지 누수되고 앱이 튕기는 문제를 정리 함수로 해결합니다.',
    beforeStats: { label: '누적 유지 메모리', value: '185 MB' },
    afterStats: { label: '누적 유지 메모리', value: '14 MB' },
    improvementRate: '누수 메모리 92% 해제',
    tags: ['메모리 누수', '정리 함수', '이벤트 리스너', '힙 스냅샷'],
    report: {
      before:
        '실무 사례: 실시간 차트 모달을 열었다 닫을 때마다 배경에서 setInterval 타이머와 이벤트 리스너가 계속 누적되어, 앱을 오래 켜둘 시 메모리가 185MB로 솟구치며 브라우저 탭 튕김 현상 발생.',
      cause:
        'useEffect 내에서 등록한 타이머 및 이벤트를 컴포넌트 언마운트 시점에 해제하는 리턴 함수를 누락함.',
      appliedTech:
        '1. 개발자 도구 힙 스냅샷 분석으로 메모리 누수 포착\n2. useEffect 리턴 함수에 clearInterval, removeEventListener 명시적 작성',
      result: '페이지 전환 및 모달 닫기 시 메모리가 185MB에서 14MB로 즉각 정상 회수.',
      retrospective:
        '싱글 페이지 애플리케이션 환경에서는 페이지가 새로고침되지 않으므로, 언마운트 시 정리 처리가 서비스의 장기 안정성을 좌우함.',
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
      '실무 상황: div 태그로 버튼을 만들고 alt 속성을 누락하여 스크린 리더 유저나 키보드 탐색 유저의 접근이 차단되는 문제를 시맨틱 HTML과 ARIA, 포커스 트랩으로 해결합니다.',
    beforeStats: { label: '라이트하우스 접근성 점수', value: '58 점' },
    afterStats: { label: '라이트하우스 접근성 점수', value: '100 점' },
    improvementRate: '100점 만점 달성',
    tags: ['접근성', '시맨틱 HTML', 'ARIA', '포커스 트랩', '라이트하우스'],
    report: {
      before:
        '실무 사례: 주요 대화형 UI가 div 클릭 형태로 구현되어 키보드 Tab 키 탐색이 불가능하고, 이미지 alt 태그 누락으로 보조공학 기술 사용자의 서비스 이용이 차단되며 라이트하우스 58점 기록.',
      cause:
        '스크린 리더의 DOM 접근성 트리를 고려하지 않은 비시맨틱 태그 사용 및 포커스 관리 누락.',
      appliedTech:
        '1. div 클릭 요소를 표준 button 및 시맨틱 태그로 완전 전환\n2. aria-label, aria-expanded 대화형 속성 추가\n3. 모달 포커스 트랩 적용',
      result: '라이트하우스 접근성 점수 58점에서 100점 만점 달성.',
      retrospective:
        '접근성 최적화는 단순히 점수 관리뿐만 아니라 다양한 사용자를 품는 서비스의 완성도 및 검색 엔진 노출 상승으로 이어진다는 점을 검증.',
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
];
