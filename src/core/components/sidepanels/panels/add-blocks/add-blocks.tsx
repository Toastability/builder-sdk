import { canvasIframeAtom, showPredefinedBlockCategoryAtom } from "@/core/atoms/ui";
import { CoreBlock } from "@/core/components/sidepanels/panels/add-blocks/core-block";
import { DefaultChaiBlocks } from "@/core/components/sidepanels/panels/add-blocks/default-blocks";
import ImportHTML from "@/core/components/sidepanels/panels/add-blocks/import-html";
import UILibrariesPanel from "@/core/components/sidepanels/panels/add-blocks/libraries-panel";
import { PartialBlocks } from "@/core/components/sidepanels/panels/add-blocks/partial-blocks";
import { CHAI_BUILDER_EVENTS } from "@/core/events";
import { useChaiAddBlockTabs } from "@/core/extensions/add-block-tabs";
import { useChaiLibraries } from "@/core/extensions/libraries";
// removed unused helpers
import { useBuilderProp, usePermissions } from "@/core/hooks";
import { usePartialBlocksList } from "@/core/hooks/use-partial-blocks-store";
import { mergeClasses, PERMISSIONS } from "@/core/main";
import { pubsub } from "@/core/pubsub";
import { Input } from "@/ui/shadcn/components/ui/input";
import { ScrollArea } from "@/ui/shadcn/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/ui/shadcn/components/ui/tabs";
import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { capitalize, filter, map, reject, sortBy, values } from "lodash-es";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

const CORE_GROUPS = ["basic", "typography", "media", "layout", "form", "advanced", "other"];
const panelTop = 48;

export const ChaiBuilderBlocks = ({ groups, blocks, parentId, position }: any) => {
  const { t } = useTranslation();
  // const [allBlocks] = useBlocksStore();
  const [searchTerm, setSearchTerm] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [tab] = useAtom(addBlockTabAtom);
  // const parentType = find(allBlocks, (block) => block._id === parentId)?._type;
  const [selectedGroup, setSelectedGroup] = useState<string | null>(groups?.[0] ?? null);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [panelLeft, setPanelLeft] = useState<number>(327); // default; recalculated on mount
  const previewRef = useRef<HTMLDivElement | null>(null);
  const groupListRef = useRef<HTMLDivElement | null>(null);

  // Focus search input on mount and tab change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchInputRef.current?.focus();
    }, 0);
    return () => clearTimeout(timeoutId);
  }, [tab]);

  // On search, close any open preview; group selection stays as-is
  useEffect(() => {
    if (searchTerm) setOpenGroup(null);
  }, [searchTerm]);

  // Calculate preview panel coordinates so it slides out just to the right
  // of the sidebar + left panel. Recompute on mount and on resize.
  useEffect(() => {
    const calc = () => {
      const leftPanel = document.getElementById("left-panel");
      const sidebar = document.getElementById("sidebar");
      const baseLeft =
        (sidebar?.getBoundingClientRect().width || 48) + (leftPanel?.getBoundingClientRect().width || 280);
      const isDesktop = window.innerWidth >= 768;
      const adjustedLeft = isDesktop ? Math.max(baseLeft - 1, 0) : baseLeft;
      setPanelLeft(adjustedLeft);
    };
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, []);

  // Close preview panel when clicking outside it (including inside the canvas iframe)
  const [canvasIframe] = useAtom(canvasIframeAtom);
  useEffect(() => {
    if (!openGroup) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (previewRef.current?.contains(target)) return;
      if (groupListRef.current?.contains(target)) return;
      setOpenGroup(null);
    };

    // Listen on main document
    document.addEventListener("mousedown", handleClickOutside);

    // Also listen inside the canvas iframe document (clicking on the canvas)
    const iframeDoc = (canvasIframe as HTMLIFrameElement | null)?.contentWindow?.document;
    iframeDoc?.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      iframeDoc?.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openGroup, canvasIframe]);

  // Immediate selection on click
  const handleGroupClick = useCallback((group: string) => {
    setSelectedGroup(group);
    setOpenGroup((current) => (current === group ? null : group));
  }, []);

  const filteredBlocks = useMemo(
    () =>
      searchTerm
        ? values(blocks).filter((block: any) =>
            (block.label?.toLowerCase() + " " + block.type?.toLowerCase()).includes(searchTerm.toLowerCase()),
          )
        : blocks,
    [blocks, searchTerm],
  );

  const filteredGroups = useMemo(
    () =>
      searchTerm
        ? groups.filter(
            (group: string) => reject(filter(values(filteredBlocks), { group }), { hidden: true }).length > 0,
          )
        : groups.filter((group: string) => reject(filter(values(blocks), { group }), { hidden: true }).length > 0),
    [blocks, filteredBlocks, groups, searchTerm],
  );

  const sortedGroups = useMemo(
    () =>
      sortBy(filteredGroups, (group: string) => (CORE_GROUPS.indexOf(group) === -1 ? 99 : CORE_GROUPS.indexOf(group))),
    [filteredGroups],
  );

  // NOTE: displayedBlocks/displayedGroups were unused after UI refactor.
  // Keeping logic simple and removing unused memos to satisfy linting.

  return (
    <div className="builder-sdk-add-blocks-panel mx-auto flex h-full w-full min-w-[200px] flex-col">
      {/* Search at top */}
      <div className="builder-sdk-add-blocks-search sticky top-0 z-10 bg-background/80 p-2 backdrop-blur-sm">
        <Input
          ref={searchInputRef}
          type="search"
          placeholder={t("Search blocks...")}
          value={searchTerm}
          className="-ml-2"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="builder-sdk-add-blocks-body sticky top-10 flex h-[calc(100%-48px)] overflow-hidden py-[25px]">
        {/* Sidebar for groups */}
        {sortedGroups.length > 0 && (
          <div ref={groupListRef} className="builder-sdk-add-blocks-groups w-full">
            <ScrollArea className="h-full">
              <div className="space-y-1 p-0">
                {sortedGroups.map((group) => (
                  <button
                    key={`sidebar-${group}`}
                    onClick={() => handleGroupClick(group)}
                    className={`w-full rounded-md px-2 py-1.5 text-left text-sm ${
                      selectedGroup === group || openGroup === group
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-primary/50 hover:text-primary-foreground"
                    }`}>
                    {capitalize(t(group.toLowerCase()))}
                  </button>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}
      </div>

      {/* Component/Block Preview Panel: slides out when a group is clicked */}
      {openGroup && (
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          ref={previewRef}
          className="builder-sdk-hover-preview z-40"
          style={{
            position: "fixed",
            top: panelTop,
            left: panelLeft,
            height: `calc(100dvh - ${panelTop}px)`,
            width: 350,
            backgroundColor: "rgba(0, 0, 0, 0.05)",
            boxShadow: "25px 0px 42px -3px rgba(0,0,0,0.42)",
            borderRight: "5px inset #5b5e65",
          }}>
          <div className="flex h-full w-full flex-col border-l border-border bg-background shadow-xl">
            <div
              className="flex h-10 items-center justify-between border-b border-border p-4 text-sm font-medium"
              style={{
                backgroundColor: "rgba(0, 0, 0, 0.05)",
              }}>
              <span>{capitalize(t(openGroup.toLowerCase()))}</span>
            </div>
            <ScrollArea className="h-full max-h-full">
              <div className="space-y-4 p-4" style={{ backgroundColor: "rgba(0, 0, 0, 0.05)" }}>
                {reject(filter(values(filteredBlocks), { group: openGroup }), { hidden: true }).map((block) => (
                  <CoreBlock
                    key={`hover-${openGroup}-${block.type}`}
                    parentId={parentId}
                    position={position}
                    block={block}
                    disabled={false}
                  />
                ))}
              </div>
            </ScrollArea>
          </div>
        </motion.div>
      )}
    </div>
  );
};

const addBlockTabAtom = atomWithStorage<string>("__add_block_tab", "library");

const AddBlocksPanel = ({
  className,
  showHeading = true,
  parentId = undefined,
  position = -1,
}: {
  parentId?: string;
  showHeading?: boolean;
  className?: string;
  position?: number;
}) => {
  const { t } = useTranslation();
  const [tab, setTab] = useAtom(addBlockTabAtom);
  const [, setCategory] = useAtom(showPredefinedBlockCategoryAtom);
  const importHTMLSupport = useBuilderProp("importHTMLSupport", true);
  const { data: partialBlocksList } = usePartialBlocksList();
  const hasPartialBlocks = Object.keys(partialBlocksList || {}).length > 0;
  const { hasPermission } = usePermissions();

  // If current tab is "partials" but there are no partial blocks, switch to "library" tab
  useEffect(() => {
    if (tab === "partials" && !hasPartialBlocks) {
      setTab("library");
    }
  }, [tab, hasPartialBlocks, setTab]);

  const close = useCallback(() => {
    pubsub.publish(CHAI_BUILDER_EVENTS.CLOSE_ADD_BLOCK);
  }, []);

  const addBlockAdditionalTabs = useChaiAddBlockTabs();
  const canImportHTML = importHTMLSupport && hasPermission(PERMISSIONS.IMPORT_HTML);
  const uiLibraries = useChaiLibraries();
  const hasUiLibraries = uiLibraries.length > 0;

  // If current tab is "library" but there are no UI libraries, switch to "core" tab
  useEffect(() => {
    if (tab === "library" && !hasUiLibraries) {
      setTab("core");
    }
  }, [tab, hasUiLibraries, setTab]);

  return (
    <div
      className={mergeClasses(
        "builder-sdk-add-blocks-container flex h-full w-full flex-col overflow-hidden",
        className,
      )}>
      {showHeading ? (
        <div className="builder-sdk-add-blocks-header mb-2 flex flex-col justify-between rounded-md bg-background/30 p-1">
          <h1 className="flex flex-col items-baseline px-1 text-xl font-semibold xl:flex-col">{t("Add block")}</h1>
          <span className="p-0 text-xs font-light leading-3 opacity-80 xl:pl-1">
            {tab === "html" ? t("Enter or paste TailwindCSS HTML snippet") : t("Click to add block to page")}
          </span>
        </div>
      ) : null}

      <Tabs
        onValueChange={(_tab) => {
          setCategory("");
          setTab(_tab);
        }}
        value={tab}
        className={"builder-sdk-add-blocks-tabs flex h-full max-h-full flex-col overflow-hidden"}>
        <TabsList className={"builder-sdk-add-blocks-tabs-list flex w-full items-center"}>
          {hasUiLibraries && <TabsTrigger value="library">{t("Library")}</TabsTrigger>}
          <TabsTrigger value="core">{t("Blocks")}</TabsTrigger>
          {hasPartialBlocks && <TabsTrigger value="partials">{t("Partials")}</TabsTrigger>}
          {/* {canImportHTML ? <TabsTrigger value="html">{t("Import")}</TabsTrigger> : null} */}
          {map(addBlockAdditionalTabs, (tab) => (
            <TabsTrigger key={`tab-add-block-${tab.id}`} value={tab.id}>
              {React.createElement(tab.tab)}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value="core" className="builder-sdk-add-blocks-tab-core h-full max-h-full flex-1 pb-[42px]">
          <div className="-mx-1.5 h-full max-h-full overflow-hidden">
            <div className="mt-2 h-full w-full">
              <DefaultChaiBlocks gridCols={"grid-cols-1 sm:grid-cols-2"} parentId={parentId} position={position} />
            </div>
          </div>
        </TabsContent>
        {hasUiLibraries && (
          <TabsContent
            value="library"
            className="builder-sdk-add-blocks-tab-library h-full max-h-full flex-1 pb-[42px]">
            <UILibrariesPanel parentId={parentId} position={position} />
          </TabsContent>
        )}
        {hasPartialBlocks && (
          <TabsContent
            value="partials"
            className="builder-sdk-add-blocks-tab-partials h-full max-h-full flex-1 pb-[42px]">
            <div className="-mx-1.5 h-full max-h-full overflow-hidden">
              <div className="mt-2 h-full w-full">
                <PartialBlocks gridCols={"grid-cols-4"} parentId={parentId} position={position} />
              </div>
            </div>
          </TabsContent>
        )}
        {canImportHTML ? (
          <TabsContent value="html" className="builder-sdk-add-blocks-tab-html h-full max-h-full flex-1 pb-[42px]">
            <ImportHTML parentId={parentId} position={position} />
          </TabsContent>
        ) : null}
        {map(addBlockAdditionalTabs, (tab) => (
          <TabsContent key={`panel-add-block-${tab.id}`} value={tab.id}>
            {React.createElement(tab.tabContent, { close, parentId, position })}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default AddBlocksPanel;
