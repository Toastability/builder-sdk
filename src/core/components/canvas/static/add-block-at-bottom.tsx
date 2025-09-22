import { useCanvasZoom, usePermissions, useSidebarActivePanel, useComponentsButtonPulse } from "@/core/hooks";
// Removed unused import: CHAI_BUILDER_EVENTS
import { PERMISSIONS } from "@/core/main";
// Removed pubsub + OPEN_ADD_BLOCK usage; now simply activates the Components panel
import { PlusIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

export const AddBlockAtBottom = () => {
  const { t } = useTranslation();
  const { hasPermission } = usePermissions();
  const [zoomPercent] = useCanvasZoom();
  const [, setActivePanel] = useSidebarActivePanel();
  const [_, setPulse] = useComponentsButtonPulse();
  const canAddBlock = hasPermission(PERMISSIONS.ADD_BLOCK);

  if (!canAddBlock) return null;

  // Keep UI affordance size constant regardless of canvas zoom (similar to block action toolbar)
  const uiScale = Math.max(zoomPercent || 100, 1) / 100; // 1.0 at 100%

  return (
    <div className="group relative w-full cursor-pointer py-2">
      <br />
      <div
        role="button"
  // Instead of opening the add-block dialog, simply focus the Components panel
        onClick={() => {
          setActivePanel("components");
          setPulse((n) => n + 1); // trigger pulse animation
        }}
        className="block h-1 rounded bg-primary opacity-0 duration-200 group-hover:opacity-100">
        <div
          className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 transform items-center gap-x-1 rounded-full bg-primary px-3 py-1 text-xs leading-tight text-white hover:bg-primary"
          style={{ transform: `translate(-50%, -50%) scale(${1 / uiScale})`, transformOrigin: "center" }}
        >
          <PlusIcon className="size-2.5 stroke-[3]" /> {t("Add block")}
        </div>
      </div>
      <br />
    </div>
  );
};
