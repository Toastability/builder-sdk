import { default as AIChatPanel } from "@/core/components/ai/ai-chat-panel";
import { AskAI } from "@/core/components/ask-ai-panel";
import CanvasArea from "@/core/components/canvas/canvas-area";
import { CanvasTopBar } from "@/core/components/canvas/topbar/canvas-top-bar";
import { Outline } from "@/core/components/index";
import { AddBlocksDialog } from "@/core/components/layout/add-blocks-dialog";
import { NoopComponent } from "@/core/components/noop-component";
import SettingsPanel from "@/core/components/settings/settings-panel";
import ThemeConfigPanel from "@/core/components/sidepanels/panels/theme-configuration/ThemeConfigPanel";
import { DefaultChaiBlocks } from "@/core/components/sidepanels/panels/add-blocks/default-blocks";
import { CHAI_BUILDER_EVENTS } from "@/core/events";
import { useChaiSidebarPanels } from "@/core/extensions/sidebar-panels";
import { useTopBarComponent } from "@/core/extensions/top-bar";
import { useBuilderProp, useSidebarActivePanel } from "@/core/hooks";
import { usePubSub } from "@/core/hooks/use-pub-sub";
import { useRightPanel, useRightPanelFullWidthMobile } from "@/core/hooks/use-theme";
import { isDevelopment } from "@/core/import-html/general";
import { useChaiFeatureFlag } from "@/core/main";
import { Button } from "@/ui/shadcn/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/ui/shadcn/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/ui/shadcn/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/ui/shadcn/components/ui/tooltip";
import { LightningBoltIcon } from "@radix-ui/react-icons";
import { useFeature } from "flagged";
import { motion } from "framer-motion";
import { compact, find, first, get } from "lodash-es";
import { Layers, Palette, SparklesIcon, X, Blocks } from "lucide-react";
import React, {
  ComponentType,
  createElement,
  MouseEvent,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";

const DEFAULT_PANEL_WIDTH = 280;

const OutlineButton = ({ isActive, show }: { isActive: boolean; show: () => void; panelId: string }) => {
  return (
    <Button variant={isActive ? "default" : "ghost"} size="icon" onClick={show}>
      <Layers size={20} />
    </Button>
  );
};

const ComponentsButton = ({ isActive, show }: { isActive: boolean; show: () => void; panelId: string }) => {
  return (
    <Button variant={isActive ? "default" : "ghost"} size="icon" onClick={show}>
      <Blocks className="h-5 w-5" />
    </Button>
  );
};

const AiButton = ({ isActive, show }: { isActive: boolean; show: () => void; panelId: string }) => {
  return (
    <Button variant={isActive ? "default" : "ghost"} size="icon" onClick={show}>
      <LightningBoltIcon className="rtl:ml-2" />
    </Button>
  );
};
const AskAiButton = ({ isActive, show }: { isActive: boolean; show: () => void; panelId: string }) => {
  return (
    <Button variant={isActive ? "default" : "ghost"} size="icon" onClick={show}>
      <SparklesIcon className="rtl:ml-2" />
    </Button>
  );
};
function useSidebarDefaultPanels() {
  const askAiCallBack = useBuilderProp("askAiCallBack", null);
  const aiChat = useFeature("aiChat");
  const aiChatLeft = useChaiFeatureFlag("enable-ai-chat-left");
  return useMemo(() => {
    const items = [] as any[];

    // New default: Components (Component Library)
    items.push({
      id: "components",
      label: "Component Library",
      isInternal: true,
      width: DEFAULT_PANEL_WIDTH,
      button: ComponentsButton,
      panel: () => (
        <div className="-mt-8">
          {/* The Component Library shows groups on the left and blocks on the right */}
          <DefaultChaiBlocks gridCols="grid-cols-1" />
        </div>
      ),
    });

    items.push({
      id: "outline",
      label: "Structure",
      isInternal: true,
      width: DEFAULT_PANEL_WIDTH,
      button: OutlineButton,
      panel: () => (
        <div className="-mt-8">
          <Outline />
        </div>
      ),
    });

    if (aiChatLeft) {
      items.unshift({
        id: "ask-ai",
        button: AskAiButton,
        label: "Ask AI",
        isInternal: true,
        width: DEFAULT_PANEL_WIDTH,
        panel: () => (
          <div className="">
            <AskAI />
          </div>
        ),
      });
    }
    if (askAiCallBack && aiChat) {
      items.unshift({
        id: "ai",
        button: AiButton,
        label: "AI Assistant",
        isInternal: true,
        width: 450,
        panel: () => (
          <div className="-mt-8 h-full max-h-full">
            <AIChatPanel />
          </div>
        ),
      });
    }
    return compact(items);
  }, [askAiCallBack, aiChat, aiChatLeft]);
}

/**
 * RootLayout is a React component that renders the main layout of the application.
 */
const RootLayout: ComponentType = () => {
  const TopBar = useTopBarComponent();
  const [activePanel, setActivePanel] = useSidebarActivePanel();
  const lastStandardPanelRef = useRef<string | null>("components"); // Default to "components"
  const [lastStandardPanelWidth, setLastStandardPanelWidth] = useState(DEFAULT_PANEL_WIDTH);

  const [panel, setRightPanel] = useRightPanel();
  const [fullWidthSettingsMobile, setFullWidthSettingsMobile] = useRightPanelFullWidthMobile();
  const defaultFullWidthMobile = useBuilderProp("defaultRightPanelFullWidthOnMobile", false);
  const [windowWidth, setWindowWidth] = useState<number>(typeof window !== "undefined" ? window.innerWidth : 1200);
  const isMobile = windowWidth < 768; // md breakpoint

  usePubSub(CHAI_BUILDER_EVENTS.SHOW_BLOCK_SETTINGS, () => {
    setActivePanel("outline");
  });

  const defaultPanels = useSidebarDefaultPanels();
  const topPanels = useChaiSidebarPanels("top");
  const bottomPanels = useChaiSidebarPanels("bottom");

  // Track window size for responsive panels
  useEffect(() => {
    const onResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Initialize mobile full-width preference from builder prop
  useEffect(() => {
    setFullWidthSettingsMobile(!!defaultFullWidthMobile);
  }, [defaultFullWidthMobile, setFullWidthSettingsMobile]);

  // Collapse left panel by default on mobile
  useEffect(() => {
    if (isMobile) setActivePanel(null);
  }, [isMobile]);

  /**
   * Prevents the context menu from appearing in production mode.
   * @param {MouseEvent<HTMLDivElement>} e - The mouse event.
   */
  const preventContextMenu = useCallback((e: MouseEvent<HTMLDivElement>) => {
    if (!isDevelopment()) e.preventDefault();
  }, []);

  const handleMenuItemClick = useCallback(
    (id: string) => {
      setActivePanel(activePanel === id ? null : id);
    },
    [activePanel],
  );

  const { t } = useTranslation();
  const allPanels = useMemo(
    () => [...defaultPanels, ...topPanels, ...bottomPanels],
    [defaultPanels, topPanels, bottomPanels],
  );
  const htmlDir = useBuilderProp("htmlDir", "ltr");

  // Update active panel item and get its width
  const activePanelItem = find(allPanels, { id: activePanel }) ?? first(allPanels);
  const panelWidth = get(activePanelItem, "width", DEFAULT_PANEL_WIDTH);

  // Keep track of the last used standard panel and its width
  useEffect(() => {
    if (activePanel !== null) {
      const currentPanelItem = find(allPanels, { id: activePanel });
      if (currentPanelItem && get(currentPanelItem, "view", "standard") === "standard") {
        lastStandardPanelRef.current = activePanel;
        setLastStandardPanelWidth(get(currentPanelItem, "width", DEFAULT_PANEL_WIDTH));
      }
    }
  }, [activePanel, allPanels]);

  // Determine the width to use for the left panel
  const leftPanelWidth = useMemo(() => {
    if (activePanel === null) return 0;
    const sidebarWidth = 48; // w-12
    if (isMobile) {
      return Math.max(0, windowWidth - sidebarWidth);
    }
    const currentPanelItem = find(allPanels, { id: activePanel });
    const isStandardPanel = get(currentPanelItem, "view", "standard") === "standard";
    return isStandardPanel ? panelWidth : lastStandardPanelWidth;
  }, [activePanel, panelWidth, lastStandardPanelWidth, allPanels, windowWidth, isMobile]);

  const handleNonStandardPanelClose = useCallback(() => {
    // Return to the last used standard panel when closing a non-standard panel
    setActivePanel(lastStandardPanelRef.current);
  }, [setActivePanel]);

  const closeNonStandardPanel = useCallback(() => {
    setActivePanel("components");
  }, [setActivePanel]);

  useEffect(() => {
    if (!find(allPanels, { id: activePanel })) {
      setActivePanel("components");
    }
  }, [activePanel, allPanels]);

  const showPanel = useCallback(
    (id: string) => {
      handleMenuItemClick(id);
    },
    [handleMenuItemClick],
  );

  return (
    <div dir={htmlDir} className="h-screen max-h-full w-screen overflow-x-hidden bg-background text-foreground builder-sdk-root">
      <TooltipProvider>
        <div
          onContextMenu={preventContextMenu}
          className="flex h-screen max-h-full flex-col bg-background text-foreground builder-sdk-shell">
          <div className="flex h-[50px] w-screen items-center border-b border-border builder-sdk-topbar">
            <Suspense>
              <TopBar />
            </Suspense>
          </div>
          <main className="relative flex h-[calc(100dvh-48px)] max-w-full flex-1 flex-row builder-sdk-main">
            <div id="sidebar" className="relative z-50 flex w-12 flex-col items-center justify-between border-r border-border py-2 builder-sdk-sidebar">
              <div className="flex flex-col gap-y-1">
                {[defaultPanels, topPanels].flat().map((item, index) => (
                  <Tooltip key={"button-top-" + index}>
                    <TooltipTrigger asChild>
                      {createElement(get(item, "button", NoopComponent), {
                        position: "top",
                        panelId: item.id,
                        isActive: activePanel === item.id,
                        show: () => showPanel(item.id),
                      })}
                    </TooltipTrigger>
                    <TooltipContent side={"right"}>
                      <p>{t(item.label)}</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
              <div className="flex flex-col space-y-1"></div>
              <div className="flex flex-col">
                {bottomPanels?.map((item, index) => {
                  return (
                    <Tooltip key={"button-bottom-" + index}>
                      <TooltipTrigger asChild>
                        {createElement(get(item, "button", NoopComponent), {
                          position: "bottom",
                          panelId: item.id,
                          isActive: activePanel === item.id,
                          show: () => showPanel(item.id),
                        })}
                      </TooltipTrigger>
                      <TooltipContent side={"right"}>
                        <p>{t(item.label)}</p>
                      </TooltipContent>
                    </Tooltip>
                  );
                })}
              </div>
            </div>
            {/* Side Panel */}
            <motion.div
              id="left-panel"
              className="h-full max-h-full border-r border-border builder-sdk-left-panel"
              initial={{ width: leftPanelWidth }}
              animate={{ width: leftPanelWidth }}
              transition={{ duration: 0.3, ease: "easeInOut" }}>
              {activePanel !== null && get(activePanelItem, "view", "standard") === "standard" && (
                <div className="no-scrollbar flex h-full flex-col overflow-hidden builder-sdk-left-panel-content">
                  {/* Header container now takes full width with background */}
                  <div
                    className={`sticky top-0 z-10 flex h-10 items-center space-x-1 border-b border-border bg-background px-3 py-2 text-base font-bold ${get(activePanelItem, "isInternal", false) ? "" : "w-full"} builder-sdk-left-panel-header`}>
                    <span>{t(get(activePanelItem, "label", ""))}</span>
                  </div>
                  <div className="no-scrollbar h-full max-h-full overflow-y-auto builder-sdk-left-panel-scroll">
                    <div className="px-3 py-2">
                      <Suspense fallback={<div>Loading...</div>}>
                        {React.createElement(get(activePanelItem, "panel", NoopComponent), {})}
                      </Suspense>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
            <div id="canvas-container" className="flex h-full max-h-full flex-1 flex-col bg-slate-800/20 builder-sdk-canvas-container">
              <CanvasTopBar />
              <Suspense>
                <CanvasArea />
              </Suspense>
            </div>
            <motion.div
              id="right-panel"
              className="h-full max-h-full border-l border-border builder-sdk-right-panel"
              initial={{ width: isMobile ? 0 : panel === "ai" ? 0 : DEFAULT_PANEL_WIDTH }}
              animate={{
                width: isMobile
                  ? panel === "block"
                    ? fullWidthSettingsMobile
                      ? windowWidth
                      : 0
                    : windowWidth
                  : panel === "ai" ? 0 : DEFAULT_PANEL_WIDTH,
              }}
              transition={{ duration: 0.3, ease: "easeInOut" }}>
              <div className="no-scrollbar overflow h-full max-h-full overflow-hidden builder-sdk-right-panel-inner">
                <div className="flex h-full max-h-full flex-col overflow-hidden p-3 builder-sdk-right-panel-content">
                  <h2 className="-mt-1 flex items-center space-x-1 text-base font-bold builder-sdk-right-panel-header">
                    <div className="flex grow items-center gap-2">
                      <div className="flex w-full items-center justify-between gap-2">
                        {panel === "ai" ? (
                          <>
                            <div className="flex items-center gap-2">
                              <LightningBoltIcon className="rtl:ml-2" /> {t("AI Assistant")}
                            </div>
                          </>
                        ) : panel === "theme" ? (
                          <div className="flex w-full items-center justify-between gap-2">
                            <span className="flex items-center gap-2">
                            <Palette className="w-4 h-4 text-gray-600" />
                              {t("Theme Settings")}
                            </span>
                            <Button
                              onClick={() => setRightPanel("block")}
                              variant="ghost"
                              size="icon"
                              className="text-xs">
                              <X className="h-4 w-4 rtl:ml-2" />
                            </Button>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </h2>
                  <div className="flex h-full max-h-full w-full builder-sdk-right-panel-body">
                    <Suspense fallback={<div>Loading...</div>}>
                      {panel === "ai" ? <AskAI /> : panel === "theme" ? <ThemeConfigPanel /> : <SettingsPanel />}
                    </Suspense>
                  </div>
                </div>
              </div>
            </motion.div>
          </main>
        </div>
        <AddBlocksDialog />
        {/* Drawer View */}
        {activePanel !== null && get(activePanelItem, "view") === "drawer" && (
          <Sheet open={true} onOpenChange={() => handleNonStandardPanelClose()}>
            <SheetContent
              side="left"
              className="flex flex-col gap-0 p-0 sm:max-w-full builder-sdk-drawer-panel"
              style={{ width: `${panelWidth}px` }}>
              <SheetHeader className="border-b border-border px-2 py-2.5">
                <SheetTitle className="flex items-center gap-2">
                  <span className="inline-block">{get(activePanelItem, "icon", null)}</span>
                  <span>{t(get(activePanelItem, "label", ""))}</span>
                </SheetTitle>
              </SheetHeader>
              <div className="h-full max-h-full overflow-y-auto p-4 builder-sdk-drawer-panel-body">
                <Suspense fallback={<div>Loading...</div>}>
                  {React.createElement(get(activePanelItem, "panel", NoopComponent), {
                    close: closeNonStandardPanel,
                  })}
                </Suspense>
              </div>
            </SheetContent>
          </Sheet>
        )}{" "}
        {/* Modal View */}
        {activePanel !== null && get(activePanelItem, "view") === "modal" && (
          <Dialog open={true} onOpenChange={() => handleNonStandardPanelClose()}>
            <DialogContent className="gap-0 p-0 builder-sdk-modal-panel" style={{ maxWidth: `${panelWidth}px` }}>
              <DialogHeader className="border-b border-border px-2 py-3.5">
                <DialogTitle className="flex items-center gap-2">
                  <span className="inline-block">{get(activePanelItem, "icon", null)}</span>
                  <span>{t(get(activePanelItem, "label", ""))}</span>
                </DialogTitle>
              </DialogHeader>
              <div className="max-h-[70vh] overflow-y-auto p-4 builder-sdk-modal-panel-body">
                <Suspense fallback={<div>Loading...</div>}>
                  {React.createElement(get(activePanelItem, "panel", NoopComponent), {
                    close: closeNonStandardPanel,
                  })}
                </Suspense>
              </div>
            </DialogContent>
          </Dialog>
        )}
        {/* Overlay View */}
        {activePanel !== null && get(activePanelItem, "view") === "overlay" && (
          <motion.div
            className="absolute bottom-0 left-12 right-0 top-0 z-50 builder-sdk-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}>
            <div className="h-full w-full">
              <motion.div
                className="flex h-full w-full flex-col bg-background builder-sdk-overlay-content"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 20, opacity: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}>
                <div className="flex h-[50px] items-center justify-between border-b border-border p-4 builder-sdk-overlay-header">
                  <div className="-ml-2 flex items-center gap-2 text-lg font-bold">
                    <span className="rtl:ml-2 rtl:inline-block">{get(activePanelItem, "icon", null)}</span>
                    <span>{t(get(activePanelItem, "label", ""))}</span>
                  </div>
                  <Button onClick={() => handleNonStandardPanelClose()} variant="ghost" size="icon" className="">
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                <div className="flex-1 overflow-y-auto p-4 builder-sdk-overlay-body">
                  <Suspense fallback={<div>Loading...</div>}>
                    {React.createElement(get(activePanelItem, "panel", NoopComponent), {
                      close: closeNonStandardPanel,
                    })}
                  </Suspense>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </TooltipProvider>
    </div>
  );
};

export { RootLayout };
