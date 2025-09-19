import { showPredefinedBlockCategoryAtom } from "@/core/atoms/ui";
import { CoreBlock } from "@/core/components/sidepanels/panels/add-blocks/core-block";
import { DefaultChaiBlocks } from "@/core/components/sidepanels/panels/add-blocks/default-blocks";
import ImportHTML from "@/core/components/sidepanels/panels/add-blocks/import-html";
import UILibrariesPanel from "@/core/components/sidepanels/panels/add-blocks/libraries-panel";
import { PartialBlocks } from "@/core/components/sidepanels/panels/add-blocks/partial-blocks";
import { CHAI_BUILDER_EVENTS } from "@/core/events";
import { useChaiAddBlockTabs } from "@/core/extensions/add-block-tabs";
import { useChaiLibraries } from "@/core/extensions/libraries";
import { canAcceptChildBlock, canBeNestedInside } from "@/core/functions/block-helpers";
import { useBlocksStore, useBuilderProp, usePermissions } from "@/core/hooks";
import { usePartialBlocksList } from "@/core/hooks/use-partial-blocks-store";
import { mergeClasses, PERMISSIONS } from "@/core/main";
import { pubsub } from "@/core/pubsub";
import { Input } from "@/ui/shadcn/components/ui/input";
import { ScrollArea } from "@/ui/shadcn/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/ui/shadcn/components/ui/tabs";
import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { capitalize, debounce, filter, find, map, reject, sortBy, values } from "lodash-es";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

const CORE_GROUPS = ["basic", "typography", "media", "layout", "form", "advanced", "other"];
const panelTop = 50;

export const ChaiBuilderBlocks = ({ groups, blocks, parentId, position, gridCols = "grid-cols-2" }: any) => {
  const { t } = useTranslation();
  const [allBlocks] = useBlocksStore();
  const [searchTerm, setSearchTerm] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [tab] = useAtom(addBlockTabAtom);
  const parentType = find(allBlocks, (block) => block._id === parentId)?._type;
  const [selectedGroup, setSelectedGroup] = useState<string | null>("all");
  const [hoveredGroup, setHoveredGroup] = useState<string | null>(null);
  const [panelLeft, setPanelLeft] = useState<number>(327); // default; recalculated on mount
  // const [panelTop, setPanelTop] = useState<number>(50); // matches topbar height
  const debouncedSelectRef = useRef<any>(null);

  // Focus search input on mount and tab change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchInputRef.current?.focus();
    }, 0);
    return () => clearTimeout(timeoutId);
  }, [tab]);

  // Reset to "all" when searching
  useEffect(() => {
    if (searchTerm) {
      setSelectedGroup("all");
      setHoveredGroup(null);
    }
  }, [searchTerm]);

  // Initialize debounced function
  useEffect(() => {
    debouncedSelectRef.current = debounce((group: string) => {
      setSelectedGroup(group);
    }, 500);

    return () => {
      if (debouncedSelectRef.current) {
        debouncedSelectRef.current.cancel();
      }
    };
  }, []);

  // Calculate preview panel coordinates so it slides out just to the right
  // of the sidebar + left panel. Recompute on mount and on resize.
  useEffect(() => {
    const calc = () => {
      const leftPanel = document.getElementById("left-panel");
      const sidebar = document.getElementById("sidebar");
      const topbar = document.querySelector<HTMLElement>(".builder-sdk-topbar");
      const left = (sidebar?.getBoundingClientRect().width || 48) + (leftPanel?.getBoundingClientRect().width || 280);
      setPanelLeft(left);
      // setPanelTop(topbar?.getBoundingClientRect().height || 50);
    };
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, []);

  // Handle hover - update hovered group immediately but debounce the selection
  const handleGroupHover = useCallback((group: string) => {
    setHoveredGroup(group);
    if (debouncedSelectRef.current) {
      debouncedSelectRef.current(group);
    }
  }, []);

  // Handle mouse leave - clear hovered group
  const handleGroupLeave = useCallback(() => {
    setHoveredGroup(null);
    if (debouncedSelectRef.current) {
      debouncedSelectRef.current.cancel();
    }
  }, []);

  // Immediate selection on click
  const handleGroupClick = useCallback((group: string) => {
    if (debouncedSelectRef.current) {
      debouncedSelectRef.current.cancel();
    }
    setSelectedGroup(group);
    setHoveredGroup(null);
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

  // Filter blocks based on selected group
  const displayedBlocks = useMemo(() => {
    if (selectedGroup === "all") {
      return filteredBlocks;
    }
    return filter(values(filteredBlocks), { group: selectedGroup });
  }, [filteredBlocks, selectedGroup]);

  // Filter groups for display based on selected group
  const displayedGroups = useMemo(() => {
    if (selectedGroup === "all") {
      return sortedGroups;
    }
    return [selectedGroup];
  }, [sortedGroups, selectedGroup]);

  return (
    <div className="mx-auto flex h-full w-full min-w-[200px] flex-col builder-sdk-add-blocks-panel">
      {/* Search at top */}
      <div className="sticky top-0 z-10 bg-background/80 p-2 backdrop-blur-sm builder-sdk-add-blocks-search">
        <Input
          ref={searchInputRef}
          type="search"
          placeholder={t("Search blocks...")}
          value={searchTerm}
          className="-ml-2"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="sticky top-10 flex h-[calc(100%-48px)] overflow-hidden builder-sdk-add-blocks-body py-[25px]">
        {/* Sidebar for groups */}
        {sortedGroups.length > 0 && (
          <div className="w-full builder-sdk-add-blocks-groups">
            <ScrollArea className="h-full">
              <div className="space-y-1 p-2">
                <button
                  key="sidebar-all"
                  onClick={() => handleGroupClick("all")}
                  onMouseEnter={() => handleGroupHover("all")}
                  className={`w-full rounded-md px-2 py-1.5 text-left text-sm font-medium ${
                    selectedGroup === "all" || hoveredGroup === "all"
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-primary/50 hover:text-primary-foreground"
                  }`}>
                  {t("All")}
                </button>
                {sortedGroups.map((group) => (
                  <button
                    key={`sidebar-${group}`}
                    onClick={() => handleGroupClick(group)}
                    onMouseEnter={() => handleGroupHover(group)}
                    className={`w-full rounded-md px-2 py-1.5 text-left text-sm ${
                      selectedGroup === group || hoveredGroup === group
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

      {/* Hover Preview Panel: slides out when a group is hovered */}
      {hoveredGroup && hoveredGroup !== "all" && (
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          onMouseLeave={handleGroupLeave}
          onMouseEnter={() => setHoveredGroup(hoveredGroup)}
          className="builder-sdk-hover-preview z-40"
          style={{
            position: "fixed",
            top: panelTop,
            left: panelLeft,
            height: `calc(100dvh - ${panelTop}px)`,
            width: 350,
          }}>
          <div className="flex h-full w-full flex-col border-l border-border bg-background shadow-xl">
            <div className="flex items-center justify-between border-b border-border px-4 h-10 text-sm font-medium">
              <span>{capitalize(t(hoveredGroup.toLowerCase()))}</span>
            </div>
            <ScrollArea className="h-full max-h-full">
              <div className="space-y-4">
                {reject(
                  filter(values(filteredBlocks), { group: hoveredGroup }),
                  { hidden: true },
                ).map((block) => (
                  <CoreBlock
                    key={`hover-${hoveredGroup}-${block.type}`}
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
    <div className={mergeClasses("flex h-full w-full flex-col overflow-hidden builder-sdk-add-blocks-container", className)}>
      {showHeading ? (
        <div className="mb-2 flex flex-col justify-between rounded-md bg-background/30 p-1 builder-sdk-add-blocks-header">
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
        className={"flex h-full max-h-full flex-col overflow-hidden builder-sdk-add-blocks-tabs"}>
        <TabsList className={"flex w-full items-center builder-sdk-add-blocks-tabs-list"}>
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
        <TabsContent value="core" className="h-full max-h-full flex-1 pb-[42px] builder-sdk-add-blocks-tab-core">
          <div className="-mx-1.5 h-full max-h-full overflow-hidden">
            <div className="mt-2 h-full w-full">
              <DefaultChaiBlocks
                gridCols={"grid-cols-1 sm:grid-cols-2"}
                parentId={parentId}
                position={position}
              />
            </div>
          </div>
        </TabsContent>
        {hasUiLibraries && (
          <TabsContent value="library" className="h-full max-h-full flex-1 pb-[42px] builder-sdk-add-blocks-tab-library">
            <UILibrariesPanel parentId={parentId} position={position} />
          </TabsContent>
        )}
        {hasPartialBlocks && (
          <TabsContent value="partials" className="h-full max-h-full flex-1 pb-[42px] builder-sdk-add-blocks-tab-partials">
            <div className="-mx-1.5 h-full max-h-full overflow-hidden">
              <div className="mt-2 h-full w-full">
                <PartialBlocks gridCols={"grid-cols-4"} parentId={parentId} position={position} />
              </div>
            </div>
          </TabsContent>
        )}
        {canImportHTML ? (
          <TabsContent value="html" className="h-full max-h-full flex-1 pb-[42px] builder-sdk-add-blocks-tab-html">
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
