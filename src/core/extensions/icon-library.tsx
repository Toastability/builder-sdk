import { cn } from "@/core/functions/common-functions";
import { Alert } from "@/ui/shadcn/components/ui/alert";
import { Badge } from "@/ui/shadcn/components/ui/badge";
import { Button } from "@/ui/shadcn/components/ui/button";
import { Input } from "@/ui/shadcn/components/ui/input";
import { Label } from "@/ui/shadcn/components/ui/label";
import { ScrollArea } from "@/ui/shadcn/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/shadcn/components/ui/select";
import { Slider } from "@/ui/shadcn/components/ui/slider";
import { Switch } from "@/ui/shadcn/components/ui/switch";
import { Loader2, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

 type IconCollection = {
  prefix: string;
  name: string;
  category?: string;
  total?: number;
  palette?: boolean;
};

 type IconListItem = {
  prefix: string;
  name: string;
  collection?: string;
};

export type IconLibraryResult = {
  /** Iconify collection prefix, e.g. lucide */
  prefix: string;
  /** Icon name within the collection */
  name: string;
  /** Raw SVG markup returned by the API */
  svg: string;
  /** Optional pixel width returned from the API */
  width?: number;
  /** Optional pixel height returned from the API */
  height?: number;
  /** Optional display label */
  label?: string;
  /** Optional tags provided by the API */
  tags?: string[];
};

export type IconLibraryProps = {
  close: () => void;
  onSelect: (icon: IconLibraryResult) => void;
  /**
   * The current icon value, if any. Allows the library to render a contextual preview
   * or hydrate custom components with the existing selection.
   */
  currentIcon?: Partial<IconLibraryResult> | null;
  /** Override the default API base URL */
  baseUrl?: string;
};

const DEFAULT_LIMIT = 100;
const DEFAULT_BASE_URL = (import.meta.env.VITE_ICON_LIBRARY_URL as string | undefined) ?? "https://icons.opensite.ai";

const normalizeColor = (value: string) => {
  if (!value) return "#1f2937";
  const trimmed = value.trim();
  if (trimmed.startsWith("#") && (trimmed.length === 7 || trimmed.length === 4)) return trimmed;
  if (/^[0-9a-f]{6}$/i.test(trimmed)) return `#${trimmed}`;
  if (/^[0-9a-f]{3}$/i.test(trimmed)) return `#${trimmed}`;
  return "#1f2937";
};

const DefaultIconLibrary = ({ close, onSelect, currentIcon, baseUrl }: IconLibraryProps) => {
  const { t } = useTranslation();
  const apiBaseUrl = (baseUrl || DEFAULT_BASE_URL).replace(/\/$/, "");

  const [collections, setCollections] = useState<IconCollection[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<string | null>(currentIcon?.prefix ?? null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedQuery, setDebouncedQuery] = useState<string>("");
  const [icons, setIcons] = useState<IconListItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState<IconListItem | null>(
    currentIcon?.prefix && currentIcon?.name ? { prefix: currentIcon.prefix, name: currentIcon.name } : null,
  );
  const [previewSvg, setPreviewSvg] = useState<string>(currentIcon?.svg ?? "");
  const [previewSize, setPreviewSize] = useState<number>(currentIcon?.width ?? 64);
  const [useCurrentColor, setUseCurrentColor] = useState<boolean>(true);
  const [customColor, setCustomColor] = useState<string>("#1f2937");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [resultsTotal, setResultsTotal] = useState<number | null>(null);

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedQuery(searchQuery.trim()), 350);
    return () => clearTimeout(timeout);
  }, [searchQuery]);

  useEffect(() => {
    let mounted = true;
    const fetchCollections = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/api/collections`);
        if (!response.ok) throw new Error("COLLECTIONS_ERROR");
        const data = await response.json();
        if (!mounted) return;
        const fetchedCollections = (data?.collections ?? []) as IconCollection[];
        setCollections(fetchedCollections);
        if (!selectedCollection && fetchedCollections.length > 0) {
          setSelectedCollection(fetchedCollections[0]?.prefix ?? null);
        }
      } catch (error) {
        if (!mounted) return;
        setStatusMessage(t("Unable to load icon collections. Please try again later."));
      }
    };
    fetchCollections();
    return () => {
      mounted = false;
    };
  }, [apiBaseUrl, selectedCollection, t]);

  useEffect(() => {
    const controller = new AbortController();
    let mounted = true;
    if (!debouncedQuery && !selectedCollection) return;
    const fetchIcons = async () => {
      try {
        setIsLoading(true);
        setStatusMessage(null);
        let items: IconListItem[] = [];
        if (debouncedQuery) {
          const params = new URLSearchParams({ q: debouncedQuery, limit: String(DEFAULT_LIMIT) });
          if (selectedCollection) params.set("prefix", selectedCollection);
          const response = await fetch(`${apiBaseUrl}/api/search?${params.toString()}`, { signal: controller.signal });
          if (!response.ok) throw new Error("SEARCH_ERROR");
          const data = await response.json();
          if (!mounted) return;
          items = ((data?.results as IconListItem[]) ?? []).map((icon) => ({
            prefix: icon.prefix,
            name: icon.name,
            collection: icon.collection,
          }));
          setResultsTotal(typeof data?.total === "number" ? data.total : items.length);
        } else if (selectedCollection) {
          const params = new URLSearchParams({ icons: "true", limit: String(DEFAULT_LIMIT) });
          const response = await fetch(`${apiBaseUrl}/api/collection/${selectedCollection}?${params.toString()}`, {
            signal: controller.signal,
          });
          if (!response.ok) throw new Error("COLLECTION_ERROR");
          const data = await response.json();
          if (!mounted) return;
          const collectionName = data?.name;
          items = ((data?.icons as string[]) ?? []).map((name: string) => ({
            prefix: data?.prefix ?? selectedCollection,
            name,
            collection: collectionName,
          }));
          setResultsTotal(typeof data?.iconsCount === "number" ? data.iconsCount : items.length);
        }
        if (!mounted) return;
        setIcons(items);
        if (items.length > 0 && !selectedIcon) {
          setSelectedIcon(items[0]);
        }
      } catch (error) {
        if (!mounted) return;
        if ((error as Error)?.name === "AbortError") return;
        setStatusMessage(t("We couldn't load icons right now. Please adjust your filters or try again."));
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };
    fetchIcons();
    return () => {
      mounted = false;
      controller.abort();
    };
  }, [apiBaseUrl, debouncedQuery, selectedCollection, selectedIcon, t]);

  useEffect(() => {
    if (!selectedIcon) return;
    const controller = new AbortController();
    let mounted = true;

    const fetchIconPreview = async () => {
      try {
        setLoadingPreview(true);
        const params = new URLSearchParams({ format: "svg", width: String(previewSize), height: String(previewSize) });
        if (!useCurrentColor && customColor) {
          params.set("color", customColor);
        }
        const response = await fetch(
          `${apiBaseUrl}/api/icon/${selectedIcon.prefix}/${selectedIcon.name}?${params.toString()}`,
          { signal: controller.signal },
        );
        if (!response.ok) throw new Error("ICON_ERROR");
        const svg = await response.text();
        if (!mounted) return;
        setPreviewSvg(svg);
      } catch (error) {
        if (!mounted) return;
        if ((error as Error)?.name === "AbortError") return;
        setStatusMessage(t("Unable to load the icon preview. Please try again."));
      } finally {
        if (mounted) {
          setLoadingPreview(false);
        }
      }
    };

    fetchIconPreview();

    return () => {
      mounted = false;
      controller.abort();
    };
  }, [apiBaseUrl, customColor, previewSize, selectedIcon, t, useCurrentColor]);

  const handleInsert = () => {
    if (!previewSvg || !selectedIcon) return;
    onSelect({
      ...selectedIcon,
      svg: previewSvg,
      width: previewSize,
      height: previewSize,
    });
  };

  const handleSelectCollection = (value: string) => {
    setSelectedCollection(value || null);
  };

  const selectedCollectionDetails = useMemo(
    () => collections.find((collection) => collection.prefix === selectedCollection) ?? null,
    [collections, selectedCollection],
  );

  return (
    <div className="flex h-full w-full flex-col bg-background">
      <div className="flex flex-col gap-3 border-b border-border px-6 py-5 md:flex-row md:items-center">
        <div className="flex items-center gap-3">
          <div className="rounded-md bg-primary/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-primary">
            {t("Icon library")}
          </div>
          {resultsTotal !== null ? (
            <Badge variant="secondary" className="text-xs">
              {resultsTotal.toLocaleString()} {t("icons")}
            </Badge>
          ) : null}
        </div>
        <div className="flex w-full flex-col gap-3 md:flex-1 md:flex-row md:items-center">
          <Input
            placeholder={t("Search icons")}
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            className="w-full md:max-w-sm"
            autoFocus
          />
          <Select value={selectedCollection ?? ""} onValueChange={handleSelectCollection}>
            <SelectTrigger className="w-full md:max-w-xs">
              <SelectValue
                placeholder={
                  collections.length > 0 ? t("All collections") : t("Loading collections…")
                }
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">{t("All collections")}</SelectItem>
              {collections.map((collection) => (
                <SelectItem key={collection.prefix} value={collection.prefix}>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{collection.name}</span>
                    <span className="text-[11px] text-muted-foreground">
                      {collection.total ? `${collection.total.toLocaleString()} icons` : collection.prefix}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button variant="ghost" size="icon" onClick={close} className="self-start md:self-auto" aria-label={t("Close")}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex flex-1 flex-col md:flex-row">
        <div className="flex-1 border-b border-border md:border-b-0 md:border-r">
          {isLoading ? (
            <div className="flex h-full items-center justify-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              {debouncedQuery ? t("Searching icons…") : t("Loading icons…")}
            </div>
          ) : icons.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-2 px-6 text-center text-sm text-muted-foreground">
              <p>{t("No icons found for your filters.")}</p>
              <p>{t("Try a different search term or choose another collection.")}</p>
            </div>
          ) : (
            <ScrollArea className="h_full w-full">
              <div className="grid grid-cols-2 gap-3 p-6 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {icons.map((icon) => {
                  const isSelected = selectedIcon?.prefix === icon.prefix && selectedIcon?.name === icon.name;
                  return (
                    <button
                      type="button"
                      key={`${icon.prefix}:${icon.name}`}
                      onClick={() => {
                        setSelectedIcon(icon);
                        setUseCurrentColor(true);
                      }}
                      className={cn(
                        "group flex flex-col items-center gap-2 rounded-lg border border-transparent bg-muted/40 p-4 text-center transition hover:border-primary hover:bg-muted",
                        isSelected ? "border-primary bg-primary/10 shadow-sm" : "",
                      )}>
                      <img
                        src={`${apiBaseUrl}/api/icon/${icon.prefix}/${icon.name}?format=svg&width=64&height=64`}
                        alt={`${icon.collection ?? icon.prefix}:${icon.name}`}
                        loading="lazy"
                        className="h-12 w-12 shrink-0"
                      />
                      <div className="flex w-full flex-col items-center gap-1 text-xs">
                        <span className="truncate font-medium text-foreground">{icon.name}</span>
                        <span className="truncate text-[10px] uppercase tracking-wide text-muted-foreground">
                          {icon.collection ?? icon.prefix}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </ScrollArea>
          )}
        </div>

        <div className="flex w-full shrink-0 flex-col gap-6 border-border bg-muted/30 p-6 md:w-[320px] md:border_l">
          <div>
            <h3 className="text-sm font-semibold">{t("Preview")}</h3>
            <div className="mt-3 flex h-40 items-center justify-center rounded-md border border-dashed border-border bg-background">
              {loadingPreview ? (
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              ) : previewSvg ? (
                <div
                  className="flex items-center justify-center"
                  style={{ width: `${previewSize}px`, height: `${previewSize}px` }}
                  dangerouslySetInnerHTML={{ __html: previewSvg }}
                />
              ) : (
                <p className="text-xs text-muted-foreground">{t("Select an icon to preview it here.")}</p>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <Label className="text-xs uppercase tracking-wide text-muted-foreground">{t("Display size")}</Label>
              <div className="mt-2 flex items-center gap-3">
                <Slider
                  value={[previewSize]}
                  min={16}
                  max={160}
                  step={4}
                  onValueChange={(value) => setPreviewSize(value[0] ?? previewSize)}
                />
                <span className="w-10 text-right text-xs font-medium text-muted-foreground">{previewSize}px</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify_between">
                <Label htmlFor="use-theme-color" className="text-xs font-medium text-muted-foreground">
                  {t("Use theme color")}
                </Label>
                <Switch
                  id="use-theme-color"
                  checked={useCurrentColor}
                  onCheckedChange={(checked) => setUseCurrentColor(checked)}
                />
              </div>
              {!useCurrentColor && (
                <div className="flex items-center gap-3">
                  <Input
                    id="icon-color"
                    type="color"
                    value={customColor}
                    onChange={(event) => setCustomColor(normalizeColor(event.target.value))}
                    className="h-9 w-12 p-1"
                  />
                  <Input
                    id="icon-color-text"
                    value={customColor}
                    onChange={(event) => setCustomColor(normalizeColor(event.target.value))}
                    className="text-xs uppercase"
                  />
                </div>
              )}
            </div>
          </div>

          {statusMessage ? (
            <Alert variant="destructive">
              <p className="text-sm text-destructive-foreground">{statusMessage}</p>
            </Alert>
          ) : null}

          <div className="mt-auto flex flex-col gap-2">
            <Button onClick={handleInsert} disabled={!previewSvg || !selectedIcon || loadingPreview}>
              {t("Insert icon")}
            </Button>
            <Button variant="outline" onClick={close}>
              {t("Cancel")}
            </Button>
          </div>

          {selectedCollectionDetails ? (
            <div className="rounded-md border border-dashed border-border bg-background p-3">
              <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {t("Collection details")}
              </h4>
              <p className="mt-2 text-xs text-muted-foreground">{selectedCollectionDetails.name}</p>
              {selectedCollectionDetails.total ? (
                <p className="text-[11px] text-muted-foreground">
                  {selectedCollectionDetails.total.toLocaleString()} {t("icons available")}
                </p>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

const ICON_LIBRARY: { component: React.ComponentType<IconLibraryProps> } = {
  component: DefaultIconLibrary,
};

export const registerChaiIconLibrary = (component: React.ComponentType<IconLibraryProps>) => {
  ICON_LIBRARY.component = component;
};

export const useIconLibraryComponent = () => {
  return useMemo(() => ICON_LIBRARY.component, []);
};
