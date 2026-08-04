import { EXPERIMENTS_DATA } from '@/entities/experiment/model/experimentsData';
import { ReportTabs } from '@/shared/ui/ReportTabs';
import { GeistCard } from '@/shared/ui/geist/GeistCard';
import { ExperimentHeader } from '@/widgets/ExperimentHeader';
import dynamic from 'next/dynamic';
import { notFound } from 'next/navigation';

// Loading Fallback for Client Sandbox Chunks
const LoadingFallback = () => (
  <GeistCard className="h-48 flex items-center justify-center space-x-2 text-sm font-mono text-neutral-700 bg-white border border-neutral-200">
    <span>실험 샌드박스 모듈 로딩 중...</span>
  </GeistCard>
);

// Dynamic Imports with ssr: false to prevent Hydration Mismatch on client sandboxes
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

export function generateStaticParams() {
  return EXPERIMENTS_DATA.map((exp) => ({
    slug: exp.slug,
  }));
}

interface ExperimentPageProps {
  params: Promise<{ slug: string }> | { slug: string };
}

export default async function ExperimentPage({ params }: ExperimentPageProps) {
  // Support both Next.js 14 and Next.js 15 async params
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
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Experiment Header Banner & Metrics */}
      <ExperimentHeader experiment={experiment} />

      {/* Interactive Sandbox Feature Component */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-black flex items-center space-x-2 font-mono">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-ping inline-block" />
          <span>실시간 측정 샌드박스</span>
        </h2>
        {renderDemo()}
      </div>

      {/* Experiment Retrospective Report & Code Comparison Document */}
      <ReportTabs
        report={experiment.report}
        codeSnippet={experiment.codeSnippet}
        titleKo={experiment.titleKo}
      />
    </div>
  );
}
