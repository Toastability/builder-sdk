// @ts-nochecks

import { canvasIframeAtom } from "@/core/atoms/ui";
import { BlockSelectionHighlighter } from "@/core/components/canvas/block-floating-actions";
import { IframeInitialContent } from "@/core/components/canvas/IframeInitialContent";
import { KeyboardHandler } from "@/core/components/canvas/keyboar-handler";
import { AddBlockAtBottom } from "@/core/components/canvas/static/add-block-at-bottom";
import { Canvas } from "@/core/components/canvas/static/chai-canvas";
import { HeadTags } from "@/core/components/canvas/static/head-tags";
import { ResizableCanvasWrapper } from "@/core/components/canvas/static/resizable-canvas-wrapper";
import { StaticBlocksRenderer } from "@/core/components/canvas/static/static-blocks-renderer";
import { useCanvasScale } from "@/core/components/canvas/static/use-canvas-scale";
import { ChaiFrame } from "@/core/frame";
import { useBuilderProp, useCanvasDisplayWidth, useHighlightBlockId } from "@/core/hooks";
import { Skeleton } from "@/ui/shadcn/components/ui/skeleton";
import { useAtom } from "jotai";
import { isEmpty } from "lodash-es";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Provider } from "react-wrap-balancer";
import { CanvasEventsWatcher } from "./canvas-events-watcher";

const StaticCanvas = () => {
  const [width] = useCanvasDisplayWidth();
  const [, highlight] = useHighlightBlockId();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [dimension, setDimension] = useState({ width: 0, height: 0 });
  const scale = useCanvasScale(dimension);
  const [, setCanvasIframe] = useAtom(canvasIframeAtom);
  const loadingCanvas = useBuilderProp("loading", false);
  const htmlDir = useBuilderProp("htmlDir", "ltr");
  const deviceWrapperEnabled = useBuilderProp("deviceWrapperEnabled", true);

  const setNewWidth = useCallback(
    (newWidth: number) => {
      setDimension((prev) => ({ ...prev, width: newWidth }));
    },
    [setDimension],
  );

  useEffect(() => {
    if (!wrapperRef.current) return;
    const { clientWidth, clientHeight } = wrapperRef.current as HTMLDivElement;
    setDimension({ width: clientWidth, height: clientHeight });
  }, [wrapperRef, width]);

  const iframeContent: string = useMemo(() => {
    let initialHTML = IframeInitialContent;
    initialHTML = initialHTML.replace("__HTML_DIR__", htmlDir);
    return initialHTML;
  }, [htmlDir]);

  // If wrapper is disabled via builder prop, render legacy container
  if (!deviceWrapperEnabled) {
    return (
      <ResizableCanvasWrapper onMount={setNewWidth} onResize={setNewWidth}>
        <div
          onMouseLeave={() => setTimeout(() => highlight(""), 300)}
          className="relative mx-auto h-full w-full overflow-hidden"
          ref={wrapperRef}>
          {/*// @ts-ignore*/}
          <ChaiFrame
            contentDidMount={() => setCanvasIframe(iframeRef.current as HTMLIFrameElement)}
            ref={iframeRef as any}
            id="canvas-iframe"
            style={{ ...scale, ...(isEmpty(scale) ? { width: `${width}px` } : {}) }}
            className="relative mx-auto box-content h-full w-full max-w-full shadow-lg transition-all duration-300 ease-linear"
            initialContent={iframeContent}>
            <KeyboardHandler />
            <BlockSelectionHighlighter />
            <HeadTags />
            <Provider>
              <Canvas>
                {loadingCanvas ? (
                  <div className="h-full p-4">
                    <Skeleton className="h-full" />
                  </div>
                ) : (
                  <StaticBlocksRenderer />
                )}
                <AddBlockAtBottom />
                <br />
                <br />
                <br />
              </Canvas>
              <CanvasEventsWatcher />
            </Provider>
            <div id="placeholder" className="pointer-events-none absolute z-[99999] max-w-full bg-green-500 transition-transform" />
          </ChaiFrame>
        </div>
      </ResizableCanvasWrapper>
    );
  }

  return (
    <ResizableCanvasWrapper onMount={setNewWidth} onResize={setNewWidth}>
      {/* Device wrapper to mimic a real page viewport */}
      <div className="builder-sdk-device-wrapper relative mx-auto h-full w-full overflow-auto">
        <div className="builder-sdk-device-shell mx-auto my-4 overflow-hidden rounded-xl border bg-background shadow-sm"
        style={{
          maxHeight: `calc(100dvh - 150px)`,
          height: `calc(100dvh - 150px)`,
        }}
        >
          <div className="builder-sdk-device-chrome flex h-8 items-center gap-2 border-b px-3">
            <div className="flex items-center gap-1.5 pr-2">
              <span className="h-3 w-3 rounded-full bg-red-400"></span>
              <span className="h-3 w-3 rounded-full bg-yellow-400"></span>
              <span className="h-3 w-3 rounded-full bg-green-400"></span>
            </div>
            <div className="h-4 flex-1 rounded bg-muted/50" />
          </div>
          <div
            onMouseLeave={() => setTimeout(() => highlight(""), 300)}
            className="builder-sdk-device-body relative mx-auto h-full w-full overflow-hidden"
            ref={wrapperRef}>
            {/*// @ts-ignore*/}
            <ChaiFrame
              contentDidMount={() => setCanvasIframe(iframeRef.current as HTMLIFrameElement)}
              ref={iframeRef as any}
              id="canvas-iframe"
              style={{ ...scale, ...(isEmpty(scale) ? { width: `${width}px` } : {}) }}
              className="relative mx-auto box-content h-full w-full max-w-full transition-all duration-300 ease-linear"
              initialContent={iframeContent}>
              <KeyboardHandler />
              <BlockSelectionHighlighter />
              <HeadTags />
              <Provider>
                <Canvas>
                  {loadingCanvas ? (
                    <div className="h-full p-4">
                      <Skeleton className="h-full" />
                    </div>
                  ) : (
                    <StaticBlocksRenderer />
                  )}
                  <AddBlockAtBottom />
                  <br />
                  <br />
                  <br />
                </Canvas>
                <CanvasEventsWatcher />
              </Provider>
              <div
                id="placeholder"
                className="pointer-events-none absolute z-[99999] max-w-full bg-green-500 transition-transform"
              />
            </ChaiFrame>
          </div>
        </div>
      </div>
    </ResizableCanvasWrapper>
  );
};

export default StaticCanvas;
