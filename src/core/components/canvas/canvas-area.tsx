import { Breadcrumb } from "@/core/components/canvas/bread-crumb";
import StaticCanvas from "@/core/components/canvas/static/static-canvas";
import { FallbackError } from "@/core/components/fallback-error";
import { useBuilderProp, useCodeEditor } from "@/core/hooks";
import { Skeleton } from "@/ui/shadcn/components/ui/skeleton";
import { noop } from "lodash-es";
import { Resizable } from "re-resizable";
import React, { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

const CodeEditor = React.lazy(() => import("@/core/components/canvas/static/code-editor"));

const CanvasArea: React.FC = () => {
  const [codeEditor] = useCodeEditor();
  const onErrorFn = useBuilderProp("onError", noop);
  return (
    <div className="flex h-full max-h-full w-full flex-1 flex-col builder-sdk-canvas-area">
      <div className="relative flex h-full max-h-full flex-col overflow-hidden bg-gray-100/40 px-2 builder-sdk-canvas-inner">
        <Suspense fallback={<Skeleton className="h-full" />}>
          <ErrorBoundary fallback={<FallbackError />} onError={onErrorFn}>
            <StaticCanvas />
          </ErrorBoundary>
        </Suspense>
        {codeEditor ? (
          <Suspense fallback={<Skeleton className="h-full" />}>
            <Resizable enable={{ top: true, bottom: false }} className="max-h-[400px] min-h-[200px]">
              <CodeEditor />
            </Resizable>
          </Suspense>
        ) : null}
        <Breadcrumb />
      </div>
    </div>
  );
};

export default CanvasArea;
