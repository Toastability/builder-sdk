import * as React from "react";
import { AnimatePresence, motion, type Transition } from "framer-motion";
import { useOnClickOutside } from "@opensite/hooks/useOnClickOutside";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import * as AnimatedTooltip from "./animated-tooltip";
import type { TooltipSide } from "./animated-tooltip";

interface Tab {
  title: string;
  icon: LucideIcon;
  type?: undefined;
}

interface Separator {
  type: "separator";
  title?: never;
  icon?: never;
}

type TabItem = Tab | Separator;

interface ExpandableIconTabsProps {
  tabs: readonly TabItem[];
  className?: string;
  activeColor?: string;
  defaultSelectedIndex?: number | null;
  onChange?: (index: number | null) => void;
  selectionRequired?: boolean;
  /** Controlled selected index. If provided, component becomes controlled. */
  selectedIndex?: number | null;
  /** Change handler for controlled mode. Always called alongside onChange when selection updates. */
  onSelectedIndexChange?: (index: number | null) => void;
  /**
   * Tooltip position relative to each tab. When enabled, tooltips are always
   * driven purely by hover (mouse enter/leave), never by selected tab state.
   */
  tooltipVariant?: "bottom" | "top" | "left" | "right" | "hidden";
  /** Optional override for tooltip offset in pixels when tooltips are enabled. */
  tooltipOffset?: number;
}

const Separator = () => <div className="mx-1 h-[24px] w-[1.2px] bg-border" aria-hidden="true" />;

const buttonVariants = {
  initial: {
    gap: 0,
    paddingLeft: ".5rem",
    paddingRight: ".5rem",
  },
  animate: (isSelected: boolean) => ({
    gap: isSelected ? ".5rem" : 0,
    paddingLeft: isSelected ? "1rem" : ".5rem",
    paddingRight: isSelected ? "1rem" : ".5rem",
  }),
};

const spanVariants = {
  initial: { width: 0, opacity: 0 },
  animate: { width: "auto", opacity: 1 },
  exit: { width: 0, opacity: 0 },
};

const transition: Transition = {
  delay: 0.1,
  type: "spring",
  bounce: 0,
  duration: 0.6,
};

export function ExpandableIconTabs({
  tabs,
  className,
  selectionRequired = false,
  activeColor = "text-primary",
  tooltipVariant = "bottom",
  defaultSelectedIndex = null,
  onChange,
  selectedIndex,
  onSelectedIndexChange,
  tooltipOffset,
}: ExpandableIconTabsProps) {
  const [uncontrolledSelected, setUncontrolledSelected] = React.useState<number | null>(defaultSelectedIndex);
  const isControlled = selectedIndex !== undefined;
  const selected = isControlled ? selectedIndex : uncontrolledSelected;
  const outsideClickRef = React.useRef<HTMLDivElement | null>(null);

  const updateSelection = React.useCallback(
    (index: number | null) => {
      if (isControlled) {
        onSelectedIndexChange?.(index);
      } else {
        setUncontrolledSelected(index);
      }
      onChange?.(index);
    },
    [isControlled, onSelectedIndexChange, onChange],
  );

  const handleSelect = React.useCallback(
    (index: number) => {
      if (!selectionRequired && selected === index) {
        updateSelection(null);
        return;
      }

      if (selected === index) {
        return;
      }

      updateSelection(index);
    },
    [selectionRequired, selected, updateSelection],
  );

  const handleOutsideClick = React.useCallback(() => {
    if (selectionRequired || selected === null) {
      return;
    }

    updateSelection(null);
  }, [selectionRequired, selected, updateSelection]);

  useOnClickOutside(outsideClickRef, handleOutsideClick);

  const tooltipSide = React.useMemo(() => {
    if (!tooltipVariant || tooltipVariant === "hidden") return null;
    return tooltipVariant as TooltipSide;
  }, [tooltipVariant]);

  const enableTooltip = tooltipSide !== null;

  const renderButton = React.useCallback(
    (t: Tab, index: number, key?: React.Key) => {
      const Icon = t.icon;
      const isSelected = selected === index;

      return (
        <motion.button
          key={key}
          type="button"
          variants={buttonVariants}
          initial={false}
          animate="animate"
          custom={isSelected}
          onClick={() => handleSelect(index)}
          transition={transition}
          className={cn(
            "relative flex items-center text-nowrap rounded-md px-4 py-2 text-sm font-semibold transition-colors duration-300",
            isSelected
              ? cn("bg-primary !text-white", activeColor)
              : "text-muted-foreground hover:bg-muted hover:text-foreground",
          )}>
          <Icon size={20} />
          <AnimatePresence initial={false}>
            {isSelected && (
              <motion.span
                variants={spanVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={transition}
                className="overflow-hidden">
                {t.title}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      );
    },
    [activeColor, handleSelect, selected],
  );

  if (!enableTooltip) {
    return (
      <div ref={outsideClickRef} className={cn("flex flex-wrap items-center gap-2", className)}>
        {tabs.map((tab, index) => {
          if (tab.type === "separator") {
            return <Separator key={`separator-${index}`} />;
          }

          const t = tab as Tab;
          return renderButton(t, index, t.title);
        })}
      </div>
    );
  }

  // Tooltip-enabled variant: wrap each tab in AnimatedTooltip.Item so the
  // label can be shown as an animated tooltip while the icon button handles
  // selection.
  return (
    <div ref={outsideClickRef}>
      <AnimatedTooltip.Root
        side={tooltipSide as TooltipSide}
        offset={tooltipOffset ?? 40}
        className={cn("flex flex-wrap items-center gap-2", className)}>
        {tabs.map((tab, index) => {
          if (tab.type === "separator") {
            return <Separator key={`separator-${index}`} />;
          }

          const t = tab as Tab;
          return (
            <AnimatedTooltip.Item key={t.title} index={index}>
              <AnimatedTooltip.Trigger>{renderButton(t, index)}</AnimatedTooltip.Trigger>
              <AnimatedTooltip.Content>{t.title}</AnimatedTooltip.Content>
            </AnimatedTooltip.Item>
          );
        })}
      </AnimatedTooltip.Root>
    </div>
  );
}
