import React, { useEffect, useMemo, useState } from "react";
import { ChaiFrame } from "@/core/frame/Frame";
import { useBlocksStore, useBrandingOptions, useLanguages } from "@/core/hooks";
import { RenderChaiBlocks, getStylesForBlocks, getChaiThemeCssVariables } from "@/render";
import { LaptopIcon, MobileIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";

// Breakpoint logical widths (match editor canvas logic where possible)
const DEVICE_VIEWPORTS = {
  mobile: 400,
  tablet: 834,
  desktop: 1280,
};
type Device = keyof typeof DEVICE_VIEWPORTS;

// Inject a viewport meta tag that matches the chosen device width so Tailwind's responsive
// classes that rely on min-width breakpoints behave the same as within the editor iframe.
function buildInitialContent(width: number, themeCss: string, blocksCss: string) {
  return `<!doctype html><html class='h-full'><head><meta charset="utf-8" />
  <meta name='viewport' content='width=${width},initial-scale=1' />
  <style>${themeCss}</style><style>${blocksCss}</style></head><body class='h-full'>
  <div class='frame-root h-full'></div></body></html>`;
}

export const DevicePreviewFrame: React.FC = () => {
  const [blocks] = useBlocksStore();
  const [branding] = useBrandingOptions(); // future: fonts, etc
  const { selectedLang } = useLanguages();
  const [device, setDevice] = useState<Device>("desktop");
  const [blocksCss, setBlocksCss] = useState("");

  // Build theme vars early (same code path as preview/editor)
  const themeVars = useMemo(() => {
    try {
      return getChaiThemeCssVariables((branding as any)?.themeValues || (branding as any));
    } catch {
      return "";
    }
  }, [branding]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const css = await getStylesForBlocks(blocks);
      if (!cancelled) setBlocksCss(css);
    })();
    return () => {
      cancelled = true;
    };
  }, [blocks]);

  const width = DEVICE_VIEWPORTS[device];

  // We rebuild initialContent when device changes to update viewport meta width.
  const initialContent = useMemo(() => buildInitialContent(width, themeVars, blocksCss), [width, themeVars, blocksCss]);

  const DeviceBtn = ({ id, label, icon }: { id: Device; label: string; icon: React.ReactNode }) => (
    <button
      onClick={() => setDevice(id)}
      className={cn(
        "flex h-7 items-center gap-1 rounded-md border px-2 text-[11px] font-medium transition-colors",
        device === id ? "bg-background/70 border-border" : "border-transparent hover:bg-muted/60",
      )}
      aria-pressed={device === id}
      aria-label={label}
    >
      {icon}
      <span className="hidden md:inline">{label}</span>
    </button>
  );

  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-background text-foreground">
      <div className="flex h-11 items-center justify-between border-b bg-white/90 px-4 backdrop-blur">
        <span className="text-xs font-medium text-muted-foreground">Preview</span>
        <div className="flex items-center gap-2">
          <DeviceBtn id="mobile" label="Mobile" icon={<MobileIcon className="h-4 w-4" />} />
          <DeviceBtn id="tablet" label="Tablet" icon={<MobileIcon className="h-4 w-4 rotate-90" />} />
          <DeviceBtn id="desktop" label="Desktop" icon={<LaptopIcon className="h-4 w-4" />} />
        </div>
      </div>
      {/* Outer scroll area stays full height; iframe page scrolls internally */}
      <div className="flex-1 overflow-auto p-4">
        {/* @ts-ignore */}
        <ChaiFrame
          key={device + width} /* remount to apply new viewport meta */
          initialContent={initialContent}
          style={{ width, maxWidth: width }}
          className={cn(
            "mx-auto h-full min-h-full border bg-white shadow-sm rounded-md overflow-hidden frame-sandbox",
          )}
        >
          <RenderChaiBlocks lang={selectedLang} blocks={blocks} />
        </ChaiFrame>
      </div>
    </div>
  );
};

export default DevicePreviewFrame;
