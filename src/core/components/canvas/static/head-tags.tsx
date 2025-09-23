import {
  getChaiThemeOptions,
  getThemeCustomFontFace,
  getThemeFontsUrls,
  getChaiThemeCssVariables,
} from "@/core/components/canvas/static/chai-theme-helpers";
import { useFrame } from "@/core/frame";
import { useDarkMode, useSelectedBlockIds, useSelectedStylingBlocks } from "@/core/hooks";
import { useTheme, useThemeOptions } from "@/core/hooks/use-theme";
import { ChaiBuilderThemeValues } from "@/types/types";
import { useRegisteredFonts } from "@chaibuilder/runtime";
import aspectRatio from "@tailwindcss/aspect-ratio";
import containerQueries from "@tailwindcss/container-queries";
import forms from "@tailwindcss/forms";
import typography from "@tailwindcss/typography";
import { filter, get, has, map } from "lodash-es";
import { useEffect, useMemo } from "react";
import plugin from "tailwindcss/plugin";

export const HeadTags = () => {
  const [chaiTheme] = useTheme();
  const chaiThemeOptions = useThemeOptions();
  const [darkMode] = useDarkMode();
  const { document: iframeDoc, window: iframeWin } = useFrame();
  // (no-op observer now; we no longer remove SDK theme if site vars exist)

  useEffect(() => {
    if (darkMode) iframeDoc?.documentElement.classList.add("dark");
    else iframeDoc?.documentElement.classList.remove("dark");
  }, [darkMode, iframeDoc]);

  // Keep SDK theme variables present; site vars injected later (by host) should override via cascade order.

  useEffect(() => {
    // @ts-ignore
    if (!iframeWin || !iframeWin.tailwind) return;
    // @ts-ignore
    iframeWin.tailwind.config = {
      darkMode: "class",
      theme: {
        extend: {
          container: {
            center: true,
            padding: "1rem",
            screens: {
              "2xl": "1400px",
            },
          },
          ...getChaiThemeOptions(chaiThemeOptions),
        },
      },

      plugins: [
        typography,
        forms,
        aspectRatio,
        containerQueries,
        plugin(function ({ addBase, theme }: any) {
          addBase({
            "h1,h2,h3,h4,h5,h6": {
              fontFamily: theme("fontFamily.heading"),
            },
            body: {
              fontFamily: theme("fontFamily.body"),
              color: theme("colors.foreground"),
              backgroundColor: theme("colors.background"),
            },
          });
        }),
      ],
    };
    // Try to refresh Tailwind runtime if present (CDN script).
    try {
      // @ts-ignore
      if (typeof iframeWin.tailwind.refresh === "function") {
        // @ts-ignore
        iframeWin.tailwind.refresh();
      }
    } catch {}
  }, [chaiTheme, chaiThemeOptions, iframeWin]);

  // Inject theme variables into iframe HEAD (never BODY) so cascade with site vars behaves predictably
  useEffect(() => {
    if (!iframeDoc) return;
    const head = iframeDoc.head;
    if (!head) return;
    const STYLE_ID = "chai-theme";
    try {
      const existing = head.querySelector(`#${STYLE_ID}`) as HTMLStyleElement | null;
      const css = getChaiThemeCssVariables(chaiTheme as ChaiBuilderThemeValues);
      let el = existing || iframeDoc.createElement("style");
      el.id = STYLE_ID;
      el.textContent = css;
      if (!existing) head.appendChild(el);
    } catch {}
  }, [iframeDoc, chaiTheme]);

  // Inject fonts (links + @font-face) into iframe HEAD
  useEffect(() => {
    if (!iframeDoc) return;
    const head = iframeDoc.head;
    if (!head) return;
    const FONT_STYLE_ID = "chai-custom-fonts";
    try {
      // Links
      const fontUrls = getThemeFontsUrls(usePickedFonts(chaiTheme));
      // Remove previous font links first
      head.querySelectorAll('link[data-chai-font="1"]').forEach((n) => n.parentNode?.removeChild(n));
      fontUrls.forEach((url) => {
        const link = iframeDoc.createElement("link");
        link.rel = "stylesheet";
        link.href = url;
        link.setAttribute("data-chai-font", "1");
        head.appendChild(link);
      });
      // Custom font-face
      const customFonts = getThemeCustomFontFace(usePickedFonts(chaiTheme, true));
      let styleEl = head.querySelector(`#${FONT_STYLE_ID}`) as HTMLStyleElement | null;
      if (!styleEl) {
        styleEl = iframeDoc.createElement("style");
        styleEl.id = FONT_STYLE_ID;
        head.appendChild(styleEl);
      }
      styleEl.textContent = customFonts;
    } catch {}
  }, [iframeDoc, chaiTheme]);

  // Inject selection highlight styles into iframe HEAD
  const selectedBlocksCss = useSelectedBlocksCss();
  const selectedStylingCss = useSelectedStylingCss();
  useEffect(() => {
    if (!iframeDoc) return;
    const head = iframeDoc.head;
    if (!head) return;
    try {
      const selId = "selected-blocks";
      let el = head.querySelector(`#${selId}`) as HTMLStyleElement | null;
      if (!el) {
        el = iframeDoc.createElement("style");
        el.id = selId;
        head.appendChild(el);
      }
      el.textContent = selectedBlocksCss;
    } catch {}
  }, [iframeDoc, selectedBlocksCss]);
  useEffect(() => {
    if (!iframeDoc) return;
    const head = iframeDoc.head;
    if (!head) return;
    try {
      const selId = "selected-styling-blocks";
      let el = head.querySelector(`#${selId}`) as HTMLStyleElement | null;
      if (!el) {
        el = iframeDoc.createElement("style");
        el.id = selId;
        head.appendChild(el);
      }
      el.textContent = selectedStylingCss;
    } catch {}
  }, [iframeDoc, selectedStylingCss]);

  return null;
};

function useSelectedStylingCss() {
  const [selectedStylingBlocks] = useSelectedStylingBlocks();
  const [selectedBlockIds] = useSelectedBlockIds();
  return useMemo(() => {
    return `${map(selectedStylingBlocks, ({ id }: any) => `[data-style-id="${id}"]`).join(",")}{
                outline: 1px solid ${selectedBlockIds.length > 0 ? "#42a1fc" : "#de8f09"} !important; outline-offset: -1px;
            }`;
  }, [selectedStylingBlocks, selectedBlockIds]);
}

function useSelectedBlocksCss() {
  const [selectedBlockIds] = useSelectedBlockIds();
  return useMemo(() => {
    return `${map(selectedBlockIds, (id) => `[data-block-id="${id}"]`).join(",")}{
                outline: 1px solid #42a1fc !important; outline-offset: -1px;
            }`;
  }, [selectedBlockIds]);
}

function usePickedFonts(chaiTheme: any, onlySrc: boolean = false) {
  const registeredFonts = useRegisteredFonts();
  return useMemo(() => {
    const { heading, body } = {
      heading: get(chaiTheme, "fontFamily.heading"),
      body: get(chaiTheme, "fontFamily.body"),
    };
    const list = registeredFonts.filter((font) => font.family === heading || font.family === body);
    return onlySrc ? filter(list, (font) => has(font, "src")) : list;
  }, [chaiTheme?.fontFamily, registeredFonts]);
}
