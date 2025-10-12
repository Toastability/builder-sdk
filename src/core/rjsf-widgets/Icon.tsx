import IconLibraryModal from "@/core/components/sidepanels/panels/icons/icon-library-modal";
import type { IconLibraryResult } from "@/core/extensions/icon-library";
import { useUpdateMultipleBlocksProps } from "@/core/hooks/use-update-blocks-props";
import type { ChaiBlock } from "@/types/chai-block";
import { Button } from "@/ui/shadcn/components/ui/button";
import { WidgetProps } from "@rjsf/utils/lib/index.js";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelectedBlock } from "../hooks";

const removeSizeAttributes = (svgString: string): string => {
  try {
    return svgString
      .replace(/<svg([^>]*)\sheight="[^"]*"([^>]*)>/gi, "<svg$1$2>")
      .replace(/<svg([^>]*)\swidth="[^"]*"([^>]*)>/gi, "<svg$1$2>");
  } catch (error) {
    return svgString;
  }
};

const PLACEHOLDER_LABEL = "SVG";

const IconPickerField = ({ value, onChange, id }: WidgetProps) => {
  const { t } = useTranslation();
  const selectedBlock = useSelectedBlock();
  const isIconBlock = selectedBlock?._type === "Icon";
  const updateBlockProps = useUpdateMultipleBlocksProps();
  const [svgInput, setSvgInput] = useState<string>(value ? String(value) : "");

  const rawBlockWidth = (selectedBlock as any)?.width;
  const rawBlockHeight = (selectedBlock as any)?.height;
  const blockWidth = typeof rawBlockWidth === "number" && rawBlockWidth > 0 ? rawBlockWidth : undefined;
  const blockHeight = typeof rawBlockHeight === "number" && rawBlockHeight > 0 ? rawBlockHeight : undefined;

  const currentIconSelection = useMemo(() => {
    if (!svgInput) return null;
    return {
      svg: svgInput,
      width: blockWidth,
      height: blockHeight,
    } as Partial<IconLibraryResult>;
  }, [svgInput, blockHeight, blockWidth]);

  useEffect(() => {
    setSvgInput(value ? String(value) : "");
  }, [value]);

  const handleSvgChange = (newSvg: string) => {
    const cleanedSvg = removeSizeAttributes(newSvg);
    setSvgInput(cleanedSvg);
    onChange(cleanedSvg);
    if (isIconBlock && selectedBlock?._id) {
      const updates: { _id: string } & Partial<ChaiBlock> = { _id: selectedBlock._id, icon: cleanedSvg };
      updateBlockProps([updates]);
    }
  };

  const handleIconSelect = (icon: IconLibraryResult) => {
    const sizeFromIcon = typeof icon.width === "number" && icon.width > 0 ? icon.width : undefined;
    const desiredSize = sizeFromIcon ?? blockWidth ?? blockHeight;

    handleSvgChange(icon.svg);

    if (isIconBlock && selectedBlock?._id) {
      const cleanedSvg = removeSizeAttributes(icon.svg);
      const updates: { _id: string } & Partial<ChaiBlock> = { _id: selectedBlock._id, icon: cleanedSvg };

      if (typeof desiredSize === "number" && !Number.isNaN(desiredSize)) {
        updates.width = desiredSize;
        updates.height = desiredSize;
      } else {
        if (typeof blockWidth === "number") updates.width = blockWidth;
        if (typeof blockHeight === "number") updates.height = blockHeight;
      }

      updateBlockProps([updates]);
    }
  };

  const clearIcon = () => {
    setSvgInput("");
    onChange("");
  };

  return (
    <div className="mt-1 flex flex-col gap-3" id="icon-picker-field">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-lg border border-border bg-muted/30 p-1">
          {svgInput ? (
            <div className="h-full w-full text-foreground" dangerouslySetInnerHTML={{ __html: svgInput }} />
          ) : (
            <span className="text-[10px] uppercase tracking-wide text-muted-foreground">{PLACEHOLDER_LABEL}</span>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <IconLibraryModal onSelect={handleIconSelect} currentIcon={currentIconSelection}>
            <Button type="button" size="sm" variant="secondary">
              {svgInput ? t("Replace icon") : t("Browse icons")}
            </Button>
          </IconLibraryModal>
          {svgInput ? (
            <Button type="button" size="sm" variant="ghost" onClick={clearIcon}>
              {t("Remove")}
            </Button>
          ) : null}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <textarea
          id={id}
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck="false"
          value={svgInput}
          onChange={(event) => handleSvgChange(event.target.value)}
          placeholder={t("Enter SVG code here")}
          rows={3}
          className="no-scrollbar w-full rounded-md border border-border bg-background px-3 py-2 text-xs shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        />
        <p className="text-xs text-muted-foreground">
          {t("Paste SVG markup directly or browse the icon library to insert an icon.")}
        </p>
      </div>
    </div>
  );
};

export { IconPickerField };
