import { EXPERIMENTS_DATA } from '@/entities/experiment/model/experimentsData';
import { ReportTabs } from '@/shared/ui/ReportTabs';
import { GeistCard } from '@/shared/ui/geist/GeistCard';
import { ExperimentHeader } from '@/widgets/ExperimentHeader';
import dynamic from 'next/dynamic';
import { notFound } from 'next/navigation';

// 클라이언트 샌드박스 청크 로딩 폴백
const LoadingFallback = () => (
  <GeistCard className="h-48 flex items-center justify-center space-x-2 text-sm font-mono text-neutral-700 bg-white border border-neutral-200">
    <span>테스트 모듈 로딩 중...</span>
  </GeistCard>
);

// 클라이언트 수화 불일치 방지를 위한 ssr: false 동적 임포트 (#1 ~ #10)
const RenderingExperiment = dynamic(
  () => import('@/features/experiments/RenderingExperiment').then((m) => m.RenderingExperiment),
  { loading: LoadingFallback, ssr: false },
);
const BundleExperiment = dynamic(
  () => import('@/features/experiments/BundleExperiment').then((m) => m.BundleExperiment),
  { loading: LoadingFallback, ssr: false },
);
const ImageExperiment = dynamic(
  () => import('@/features/experiments/ImageExperiment').then((m) => m.ImageExperiment),
  { loading: LoadingFallback, ssr: false },
);
const RenderingStrategyExperiment = dynamic(
  () =>
    import('@/features/experiments/RenderingStrategyExperiment').then(
      (m) => m.RenderingStrategyExperiment,
    ),
  { loading: LoadingFallback, ssr: false },
);
const VirtualizationExperiment = dynamic(
  () =>
    import('@/features/experiments/VirtualizationExperiment').then(
      (m) => m.VirtualizationExperiment,
    ),
  { loading: LoadingFallback, ssr: false },
);
const SearchExperiment = dynamic(
  () => import('@/features/experiments/SearchExperiment').then((m) => m.SearchExperiment),
  { loading: LoadingFallback, ssr: false },
);
const NetworkExperiment = dynamic(
  () => import('@/features/experiments/NetworkExperiment').then((m) => m.NetworkExperiment),
  { loading: LoadingFallback, ssr: false },
);
const SkeletonExperiment = dynamic(
  () => import('@/features/experiments/SkeletonExperiment').then((m) => m.SkeletonExperiment),
  { loading: LoadingFallback, ssr: false },
);
const MemoryLeakExperiment = dynamic(
  () => import('@/features/experiments/MemoryLeakExperiment').then((m) => m.MemoryLeakExperiment),
  { loading: LoadingFallback, ssr: false },
);
const AccessibilityExperiment = dynamic(
  () =>
    import('@/features/experiments/AccessibilityExperiment').then((m) => m.AccessibilityExperiment),
  { loading: LoadingFallback, ssr: false },
);

// 신규 추가 샌드박스 (#11 ~ #20)
const ContextSplittingExperiment = dynamic(
  () =>
    import('@/features/experiments/ContextSplittingExperiment').then(
      (m) => m.ContextSplittingExperiment,
    ),
  { loading: LoadingFallback, ssr: false },
);
const TanStackQueryCacheExperiment = dynamic(
  () =>
    import('@/features/experiments/TanStackQueryCacheExperiment').then(
      (m) => m.TanStackQueryCacheExperiment,
    ),
  { loading: LoadingFallback, ssr: false },
);
const WebSocketBatchingExperiment = dynamic(
  () =>
    import('@/features/experiments/WebSocketBatchingExperiment').then(
      (m) => m.WebSocketBatchingExperiment,
    ),
  { loading: LoadingFallback, ssr: false },
);
const InfiniteScrollExperiment = dynamic(
  () =>
    import('@/features/experiments/InfiniteScrollExperiment').then(
      (m) => m.InfiniteScrollExperiment,
    ),
  { loading: LoadingFallback, ssr: false },
);
const LayoutThrashingExperiment = dynamic(
  () =>
    import('@/features/experiments/LayoutThrashingExperiment').then(
      (m) => m.LayoutThrashingExperiment,
    ),
  { loading: LoadingFallback, ssr: false },
);
const CssAnimationExperiment = dynamic(
  () =>
    import('@/features/experiments/CssAnimationExperiment').then((m) => m.CssAnimationExperiment),
  { loading: LoadingFallback, ssr: false },
);
const FontOptimizationExperiment = dynamic(
  () =>
    import('@/features/experiments/FontOptimizationExperiment').then(
      (m) => m.FontOptimizationExperiment,
    ),
  { loading: LoadingFallback, ssr: false },
);
const ApiParallelExperiment = dynamic(
  () => import('@/features/experiments/ApiParallelExperiment').then((m) => m.ApiParallelExperiment),
  { loading: LoadingFallback, ssr: false },
);
const ScriptLoadingExperiment = dynamic(
  () =>
    import('@/features/experiments/ScriptLoadingExperiment').then((m) => m.ScriptLoadingExperiment),
  { loading: LoadingFallback, ssr: false },
);
const SuspenseStreamingExperiment = dynamic(
  () =>
    import('@/features/experiments/SuspenseStreamingExperiment').then(
      (m) => m.SuspenseStreamingExperiment,
    ),
  { loading: LoadingFallback, ssr: false },
);

export function generateStaticParams() {
  return EXPERIMENTS_DATA.map((exp) => ({
    slug: exp.slug,
  }));
}

interface ExperimentPageProps {
  params: Promise<{ slug: string }> | { slug: string };
}

export default async function ExperimentPage({ params }: ExperimentPageProps) {
  // Next.js 14 및 15 비동기 파라미터 호환 처리
  const resolvedParams = await params;
  const experiment = EXPERIMENTS_DATA.find((e) => e.slug === resolvedParams.slug);

  if (!experiment) {
    notFound();
  }

  const renderDemo = () => {
    switch (experiment.id) {
      case 'rendering':
        return <RenderingExperiment />;
      case 'bundle':
        return <BundleExperiment />;
      case 'image':
        return <ImageExperiment />;
      case 'rendering-strategy':
        return <RenderingStrategyExperiment />;
      case 'virtualization':
        return <VirtualizationExperiment />;
      case 'search':
        return <SearchExperiment />;
      case 'network':
        return <NetworkExperiment />;
      case 'skeleton':
        return <SkeletonExperiment />;
      case 'memory-leak':
        return <MemoryLeakExperiment />;
      case 'accessibility':
        return <AccessibilityExperiment />;
      case 'context-splitting':
        return <ContextSplittingExperiment />;
      case 'tanstack-query-cache':
        return <TanStackQueryCacheExperiment />;
      case 'websocket-batching':
        return <WebSocketBatchingExperiment />;
      case 'infinite-scroll':
        return <InfiniteScrollExperiment />;
      case 'layout-thrashing':
        return <LayoutThrashingExperiment />;
      case 'css-animation-gpu':
        return <CssAnimationExperiment />;
      case 'font-cls-optimization':
        return <FontOptimizationExperiment />;
      case 'api-waterfall-parallel':
        return <ApiParallelExperiment />;
      case 'script-loading-strategy':
        return <ScriptLoadingExperiment />;
      case 'suspense-streaming-ssr':
        return <SuspenseStreamingExperiment />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* 테스트 헤더 배너 및 수치 요약 */}
      <ExperimentHeader experiment={experiment} />

      {/* 인터랙티브 샌드박스 컴포넌트 */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-black flex items-center space-x-2 font-mono">
          <span>성능 테스트</span>
        </h2>
        {renderDemo()}
      </div>

      {/* 테스트 회고 리포트 및 소스코드 비교 분석 문서 */}
      <ReportTabs
        report={experiment.report}
        codeSnippet={experiment.codeSnippet}
        titleKo={experiment.titleKo}
      />
    </div>
  );
}
