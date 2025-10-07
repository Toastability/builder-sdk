import { treeRefAtom } from "@/core/atoms/ui";
import { CHAI_BUILDER_EVENTS } from "@/core/events";
import { useFrame } from "@/core/frame";
import { useBlockHighlight, useSelectedBlockIds, useSelectedStylingBlocks } from "@/core/hooks";
import { usePubSub } from "@/core/hooks/use-pub-sub";
import { useAtom } from "jotai";
import { first, includes, isEmpty } from "lodash-es";
import { useEffect } from "react";
import { getElementByDataBlockId } from "./chai-canvas";

export const CanvasEventsWatcher = () => {
  const [, setIds] = useSelectedBlockIds();
  const [styleIds, setSelectedStylingBlocks] = useSelectedStylingBlocks();
  const { document } = useFrame();
  const { clearHighlight } = useBlockHighlight();
  const [ids] = useSelectedBlockIds();
  const [treeRef] = useAtom(treeRefAtom);

  useEffect(() => {
    setTimeout(() => {
      if (!isEmpty(styleIds)) {
        return;
      }
      const element = getElementByDataBlockId(document, first(ids) as string);
      if (element) {
        const styleProp = element.getAttribute("data-style-prop") as string;
        if (styleProp) {
          const styleId = element.getAttribute("data-style-id") as string;
          const blockId = element.getAttribute("data-block-parent") as string;
          setSelectedStylingBlocks([{ id: styleId, prop: styleProp, blockId }]);
        }
      }
    }, 100);
  }, [document, ids, setSelectedStylingBlocks, styleIds]);
  // Add cleanup effect
  useEffect(() => {
    return () => clearHighlight();
  }, [clearHighlight]);

  usePubSub(CHAI_BUILDER_EVENTS.CANVAS_BLOCK_SELECTED, (blocks: string[]) => {
    if (!blocks) return;
    if (!isEmpty(blocks) && !includes(ids, first(blocks))) {
      treeRef?.closeAll();
    }
    setIds(blocks);
  });

  usePubSub(CHAI_BUILDER_EVENTS.CANVAS_BLOCK_STYLE_SELECTED, (data) => {
    if (!data) return;
    const { blockId, styleId, styleProp } = data as { blockId: string; styleId: string; styleProp: string };
    if (!blockId) return;
    if (!includes(ids, blockId)) {
      treeRef?.closeAll();
    }
    setSelectedStylingBlocks([{ id: styleId, prop: styleProp, blockId }]);
    setIds([blockId]);
  });

  usePubSub(CHAI_BUILDER_EVENTS.CLEAR_CANVAS_SELECTION, () => {
    clearHighlight();
    setIds([]);
    setSelectedStylingBlocks([]);
  });

  useEffect(() => {
    if (!document) return;

    const SLIDER_STATE = Symbol("chai-slider-state");

    type SliderController = {
      cleanup: () => void;
    };

    const isBlockSelected = (root: HTMLElement): boolean => {
      const blockId = root.getAttribute("data-block-id");
      if (!blockId) return false;
      if (ids.includes(blockId)) return true;

      const allDescendants = root.querySelectorAll("[data-block-id]");
      for (const descendant of Array.from(allDescendants)) {
        const descId = descendant.getAttribute("data-block-id");
        if (descId && ids.includes(descId)) return true;
      }

      return false;
    };

    const initializeSlider = (root: HTMLElement): SliderController | null => {
      const track =
        root.querySelector<HTMLElement>("[data-slider-track]") ?? root.querySelector<HTMLElement>(".slider-container");
      const slides = track
        ? Array.from(track.querySelectorAll<HTMLElement>("[data-slider-slide], .slider-slide"))
        : Array.from(root.querySelectorAll<HTMLElement>("[data-slider-slide], .slider-slide"));

      if (!track || !slides.length) return null;

      let currentIndex = Math.max(
        0,
        slides.findIndex((slide) => slide.classList.contains("is-active")),
      );
      if (currentIndex < 0) currentIndex = 0;

      let lockScroll = false;
      let lockTimer: number | undefined;
      let syncFrame: number | undefined;
      let autoplayTimer: number | undefined;

      const dots = Array.from(root.querySelectorAll<HTMLElement>("[data-slider-dot]"));
      const prevButtons = Array.from(root.querySelectorAll<HTMLButtonElement>("[data-slider-prev]"));
      const nextButtons = Array.from(root.querySelectorAll<HTMLButtonElement>("[data-slider-next]"));

      const updateActive = (index: number) => {
        const total = slides.length;
        if (!total) return;
        const target = ((index % total) + total) % total;

        if (currentIndex === target) return;

        currentIndex = target;

        slides.forEach((slide, idx) => {
          slide.classList.remove("is-active");
          slide.setAttribute("aria-hidden", "true");

          if (idx === currentIndex) {
            slide.classList.add("is-active");
            slide.setAttribute("aria-hidden", "false");
          }
        });

        dots.forEach((dot, idx) => dot.classList.toggle("is-active", idx === currentIndex));

        lockScroll = true;
        const left = slides[currentIndex].offsetLeft - (track.offsetLeft || 0);

        track.scrollTo({
          left,
          behavior: "auto",
        });

        if (lockTimer) window.clearTimeout(lockTimer);
        lockTimer = window.setTimeout(() => {
          lockScroll = false;
        }, 100) as unknown as number;
      };

      slides[0]?.classList.add("is-active");
      slides[0]?.setAttribute("aria-hidden", "false");
      dots[0]?.classList.add("is-active");

      const goPrevious = () => updateActive(currentIndex - 1);
      const goNext = () => updateActive(currentIndex + 1);
      const dotHandlers: Array<() => void> = [];

      prevButtons.forEach((btn) => btn.addEventListener("click", goPrevious));
      nextButtons.forEach((btn) => btn.addEventListener("click", goNext));
      dots.forEach((btn, idx) => {
        const handler = () => updateActive(idx);
        dotHandlers.push(handler);
        btn.addEventListener("click", handler);
      });

      const pauseInteractions = () => {
        if (lockTimer) window.clearTimeout(lockTimer);
        lockScroll = false;
      };

      const handleScroll = () => {
        if (lockScroll) return;
        if (syncFrame) window.cancelAnimationFrame(syncFrame);
        syncFrame = window.requestAnimationFrame(() => {
          const center = track.scrollLeft + track.clientWidth / 2;
          let nearest = currentIndex;
          let minDelta = Number.POSITIVE_INFINITY;
          slides.forEach((slide, idx) => {
            const slideCenter = slide.offsetLeft + slide.offsetWidth / 2;
            const delta = Math.abs(slideCenter - center);
            if (delta < minDelta) {
              minDelta = delta;
              nearest = idx;
            }
          });
          if (nearest !== currentIndex) {
            currentIndex = nearest;
            slides.forEach((slide, idx) => slide.classList.toggle("is-active", idx === currentIndex));
            dots.forEach((dot, idx) => dot.classList.toggle("is-active", idx === currentIndex));
          }
        });
      };

      track.addEventListener("scroll", handleScroll, { passive: true });

      const autoplayEnabled = root.dataset.autoplay !== "false";
      const autoplayInterval = Number(root.dataset.autoplayInterval || "6000");

      let resumeTimer: number | undefined;

      const navControls = root.querySelector<HTMLElement>("[data-slider-controls]");

      const updateControlsVisibility = () => {
        const selected = isBlockSelected(root);
        if (navControls) {
          navControls.style.opacity = "1";
        }
        if (selected) {
          stopAutoplay();
        } else {
          if (!autoplayTimer && autoplayEnabled) {
            startAutoplay();
          }
        }
      };

      const startAutoplay = () => {
        if (!autoplayEnabled || slides.length < 2) return;
        if (isBlockSelected(root)) return;
        if (autoplayTimer) window.clearInterval(autoplayTimer);
        autoplayTimer = window.setInterval(() => {
          if (document.hidden) return;
          if (isBlockSelected(root)) {
            stopAutoplay();
            return;
          }
          updateActive(currentIndex + 1);
        }, autoplayInterval) as unknown as number;
      };

      const stopAutoplay = () => {
        if (autoplayTimer) window.clearInterval(autoplayTimer);
        autoplayTimer = undefined;
      };

      const haltAndScheduleResume = () => {
        stopAutoplay();
        pauseInteractions();
        if (resumeTimer) window.clearTimeout(resumeTimer);
        resumeTimer = window.setTimeout(
          () => {
            startAutoplay();
          },
          Math.max(autoplayInterval, 6000),
        ) as unknown as number;
      };

      root.addEventListener("pointerdown", haltAndScheduleResume);
      root.addEventListener("focusin", haltAndScheduleResume);
      root.addEventListener("keydown", haltAndScheduleResume);

      updateControlsVisibility();
      startAutoplay();

      const cleanup = () => {
        prevButtons.forEach((btn) => btn.removeEventListener("click", goPrevious));
        nextButtons.forEach((btn) => btn.removeEventListener("click", goNext));
        dots.forEach((btn, idx) => btn.removeEventListener("click", dotHandlers[idx]));
        track.removeEventListener("scroll", handleScroll);
        root.removeEventListener("pointerdown", haltAndScheduleResume);
        root.removeEventListener("focusin", haltAndScheduleResume);
        root.removeEventListener("keydown", haltAndScheduleResume);
        if (syncFrame) window.cancelAnimationFrame(syncFrame);
        stopAutoplay();
        if (resumeTimer) window.clearTimeout(resumeTimer);
      };

      return { cleanup };
    };

    const activeControllers = new Map<HTMLElement, SliderController>();

    const ensureSlider = (root: HTMLElement) => {
      const existing = (root as any)[SLIDER_STATE] as SliderController | undefined;
      if (existing) existing.cleanup();
      const controller = initializeSlider(root);
      if (controller) {
        (root as any)[SLIDER_STATE] = controller;
        activeControllers.set(root, controller);
      }
    };

    Array.from(document.querySelectorAll("[data-slider-root]")).forEach((root) => ensureSlider(root as HTMLElement));

    const observer = new MutationObserver(() => {
      const currentRoots = Array.from(document.querySelectorAll("[data-slider-root]")) as HTMLElement[];
      currentRoots.forEach(ensureSlider);
      activeControllers.forEach((controller, root) => {
        if (!currentRoots.includes(root)) {
          controller.cleanup();
          activeControllers.delete(root);
          delete (root as any)[SLIDER_STATE];
        }
      });
    });

    observer.observe(document.body, { subtree: true, childList: true });

    return () => {
      observer.disconnect();
      activeControllers.forEach((controller) => controller.cleanup());
      activeControllers.clear();
    };
  }, [document, ids]);

  return null;
};
