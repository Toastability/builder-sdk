import { lsBlocksAtom, lsThemeAtom } from "@/_demo/atoms-dev";
import registerCustomBlocks from "@/_demo/blocks";
import { getChaiThemeCssVariables, getStylesForBlocks, RenderChaiBlocks } from "@/render";
import { getMergedPartialBlocks } from "@/render/functions";
import { loadWebBlocks } from "@/web-blocks";
import { useAtom } from "jotai";
import { useEffect, useMemo, useState } from "react";
import { EXTERNAL_DATA } from "./_demo/EXTERNAL_DATA";
import { PARTIALS } from "./_demo/PARTIALS";
import { ChaiBuilderThemeValues } from "./types/types";
import { LaptopIcon, MobileIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";

// --- Assumptions / constants ---
// Wider bounds requirement: allow wider preview container but do not exceed a max width for desktop.
// These values can be adjusted or sourced from a shared breakpoint definition later.
const DEVICE_SIZES = {
  // Using common device logical pixel widths; adjust if product wants different references
  mobile: 400, // ~iPhone 15 Pro logical width (portrait)
  tablet: 834, // iPad (11") logical width portrait
  desktop: 1280, // desktop max width (red box constraint from screenshot)
};

type Device = keyof typeof DEVICE_SIZES;

loadWebBlocks();
registerCustomBlocks();

function Preview() {
  const [blocks] = useAtom(lsBlocksAtom);
  const [theme] = useAtom(lsThemeAtom);

  const [allStyles, setStyles] = useState("");
  const [device, setDevice] = useState<Device>("desktop");

  useEffect(() => {
    (async () => {
      const styles = await getStylesForBlocks(blocks);
      setStyles(styles);
    })();
  }, [blocks]);
  const themeVars = useMemo(() => getChaiThemeCssVariables(theme as ChaiBuilderThemeValues), [theme]);
  
  // Compute style for the scalable preview container.
  const width = DEVICE_SIZES[device];
  // For desktop we allow container to be "up to" the max but also fluid under it.
  const containerStyle: React.CSSProperties =
    device === "desktop"
      ? { maxWidth: width, width: "100%" }
      : { width };

  const DeviceButton = ({ id, label, icon }: { id: Device; label: string; icon: React.ReactNode }) => (
    <button
      onClick={() => setDevice(id)}
      className={cn(
        "flex h-7 items-center gap-1 rounded-md border px-2 text-xs transition-colors",
        device === id
          ? "bg-background/50 border-border" // active state
          : "border-transparent bg-transparent hover:bg-muted/60",
      )}
      aria-pressed={device === id}
      aria-label={label}>
      {icon}
      <span className="hidden md:inline">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen w-full bg-background text-foreground">
      <style>{themeVars}</style>
      <style>{allStyles}</style>
      {/* Custom top bar replacing editor top bar (Back to Editor + device toggles) */}
      <div className="sticky top-0 z-40 flex h-11 w-full items-center justify-between border-b bg-white/90 px-4 backdrop-blur">
        <div className="flex items-center gap-3">
          <a
            href="/" // Root path is the current editor route (adjust if editor path differs)
            className="text-xs font-medium text-blue-600 hover:underline"
          >
            ← Back to Editor
          </a>
        </div>
        <div className="flex items-center gap-2">
          <DeviceButton id="mobile" label="Mobile" icon={<MobileIcon className="h-4 w-4" />} />
          <DeviceButton id="tablet" label="Tablet" icon={<MobileIcon className="h-4 w-4 rotate-90" />} />
          <DeviceButton id="desktop" label="Desktop" icon={<LaptopIcon className="h-4 w-4" />} />
        </div>
      </div>
      {/* Center the preview container and allow wider bounds but not exceed max for desktop */}
      <div className="mx-auto flex w-full justify-center p-4">
        <div
          className={cn(
            "builder-preview-container relative w-full rounded-md border bg-white shadow-sm transition-all",
            device !== "desktop" && "overflow-hidden", // emulate device frame clipping for smaller devices
          )}
          style={containerStyle}
          data-device={device}
        >
          <RenderChaiBlocks
            lang="fr"
            fallbackLang="en"
            externalData={{
              ...EXTERNAL_DATA,
              "#promotions/ppqlwb": [
                { name: "Promotion 1", date: "2025-05-19", image: "https://picsum.photos/500/300" },
                { name: "Promotion 2", date: "2025-05-20", image: "https://picsum.photos/500/310" },
              ],
            }}
            pageProps={{ slug: "chai-builder" }}
            draft={true}
            blocks={getMergedPartialBlocks(blocks, PARTIALS)}
            dataProviderMetadataCallback={(block, meta) => {
              console.log("meta", meta);
              console.log("block", block);
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default Preview;
