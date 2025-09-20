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
import { useBuilderProp, useCanvasDisplayWidth, useCanvasZoom, useHighlightBlockId } from "@/core/hooks";
import { Skeleton } from "@/ui/shadcn/components/ui/skeleton";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/ui/shadcn/components/ui/dialog";
import { Input } from "@/ui/shadcn/components/ui/input";
import { Button } from "@/ui/shadcn/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/ui/shadcn/components/ui/dropdown-menu";
import { useAtom } from "jotai";
import { isEmpty } from "lodash-es";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Provider } from "react-wrap-balancer";
import { CanvasEventsWatcher } from "./canvas-events-watcher";
import { Breakpoints } from "@/core/components/canvas/topbar/canvas-breakpoints";
import { UndoRedo } from "@/core/components/canvas/topbar/undo-redo";
import { ClearCanvas } from "@/core/components/canvas/topbar/clear-canvas";
import { round } from "lodash-es";
import { DotsVerticalIcon, HamburgerMenuIcon } from "@radix-ui/react-icons";

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
  const pageMeta = useBuilderProp("pageMeta", null as any);
  const emptyState = useBuilderProp("emptyState", null as any);
  const [zoom] = useCanvasZoom();

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
                {emptyState ? emptyState : null}
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

  const [metaDialogOpen, setMetaDialogOpen] = useState(false);

  return (
    <ResizableCanvasWrapper onMount={setNewWidth} onResize={setNewWidth}>
      {/* Device wrapper to mimic a real page viewport */}
      <div className="builder-sdk-device-wrapper relative mx-auto h-full w-full overflow-auto">
        <div
          className="builder-sdk-device-shell mx-auto my-4 overflow-hidden rounded-xl border bg-background shadow-sm"
          style={{
            maxHeight: `calc(100dvh - 150px)`,
            height: `calc(100dvh - 150px)`,
            // Make the shell width respond to selected device width
            width: `${Math.min(width, dimension.width || width)}px`,
            maxWidth: "100%",
          }}>
          {/* Browser chrome */}
          <div className="builder-sdk-device-chrome flex h-10 items-center gap-2 border-b px-3">
            {/* traffic lights */}
            <div className="flex items-center gap-1.5 pr-2">
              <span className="h-3 w-3 rounded-full bg-red-400"></span>
              <span className="h-3 w-3 rounded-full bg-yellow-400"></span>
              <span className="h-3 w-3 rounded-full bg-green-400"></span>
            </div>

            {/* URL bar -> clickable title/permalink */}
            <div className="flex min-w-0 flex-1 items-center">
              {/* Desktop/tablet: show inline URL bar */}
              <div className="hidden w-full md:block">
                <Dialog open={metaDialogOpen} onOpenChange={setMetaDialogOpen}>
                  <DialogTrigger asChild>
                    <button
                      type="button"
                      className="group flex w-full items-center justify-start gap-2 truncate rounded-md border bg-muted/40 px-3 py-1.5 text-left text-xs hover:bg-muted/60"
                      title={pageMeta?.permalink || "Edit page meta"}>
                      <span className="truncate font-semibold text-foreground/90">
                        {pageMeta?.title || "Untitled"}
                      </span>
                      <span className="truncate text-muted-foreground">{pageMeta?.permalink || "/permalink"}</span>
                    </button>
                  </DialogTrigger>
                  <DialogContent className="max-w-lg">
                    <DialogHeader>
                      <DialogTitle>Edit page details</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-muted-foreground">Title</label>
                        <Input
                          defaultValue={pageMeta?.title || ""}
                          onChange={(e) => pageMeta?.onTitleChange && pageMeta.onTitleChange(e.target.value)}
                          placeholder="Page title"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-muted-foreground">Permalink</label>
                        <Input
                          defaultValue={pageMeta?.permalink || ""}
                          onChange={(e) => pageMeta?.onPermalinkChange && pageMeta.onPermalinkChange(e.target.value)}
                          placeholder="/your-slug"
                        />
                        {pageMeta?.permalinkErrorMessage ? (
                          <p className="text-xs text-destructive">{pageMeta.permalinkErrorMessage}</p>
                        ) : null}
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="button" variant="default" onClick={() => setMetaDialogOpen(false)}>
                        Close
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              {/* Mobile: condense into a dropdown */}
              <div className="md:hidden">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-7 w-7" aria-label="Open page menu">
                      <HamburgerMenuIcon />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel>Page</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setMetaDialogOpen(true)}>Edit page details</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                {/* Dialog controlled by state so it can be opened from the menu */}
                <Dialog open={metaDialogOpen} onOpenChange={setMetaDialogOpen}>
                  <DialogContent className="max-w-lg">
                    <DialogHeader>
                      <DialogTitle>Edit page details</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-muted-foreground">Title</label>
                        <Input
                          defaultValue={pageMeta?.title || ""}
                          onChange={(e) => pageMeta?.onTitleChange && pageMeta.onTitleChange(e.target.value)}
                          placeholder="Page title"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-muted-foreground">Permalink</label>
                        <Input
                          defaultValue={pageMeta?.permalink || ""}
                          onChange={(e) => pageMeta?.onPermalinkChange && pageMeta.onPermalinkChange(e.target.value)}
                          placeholder="/your-slug"
                        />
                        {pageMeta?.permalinkErrorMessage ? (
                          <p className="text-xs text-destructive">{pageMeta.permalinkErrorMessage}</p>
                        ) : null}
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="button" variant="default" onClick={() => setMetaDialogOpen(false)}>
                        Close
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            {/* Controls moved from canvas topbar to the shell, aligned right */}
            {/* Desktop/tablet controls */}
            <div className="hidden items-center gap-2 md:flex">
              <Breakpoints canvas openDelay={400} tooltip={false} />
              <UndoRedo />
              <ClearCanvas />
            </div>
            {/* Mobile: condense right-side actions */}
            <div className="md:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-7 w-7" aria-label="Open actions menu">
                    <DotsVerticalIcon />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <div className="px-2 py-1.5">
                    <div className="mb-1 text-xs text-muted-foreground">Screen size</div>
                    <Breakpoints canvas openDelay={0} tooltip={false} />
                  </div>
                  <DropdownMenuSeparator />
                  <div className="px-2 py-1.5 text-xs text-muted-foreground">Zoom: {round(zoom as any, 0)}%</div>
                  <DropdownMenuSeparator />
                  <div className="flex items-center gap-2 px-2 py-1.5">
                    <UndoRedo />
                    <ClearCanvas />
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <div
            onMouseLeave={() => setTimeout(() => highlight(""), 300)}
            className="builder-sdk-device-body relative mx-auto h-full w-full overflow-auto"
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
                  {/* Optional empty state from client */}
                  {emptyState ? emptyState : null}
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
