import { cn } from "@/core/functions/common-functions";
import { useBuilderProp, usePreviewMode } from "@/core/hooks";
import { Button } from "@/ui/shadcn/components/ui/button";
import { Skeleton } from "@/ui/shadcn/components/ui/skeleton";
import { EyeClosedIcon } from "@radix-ui/react-icons";
import React, { Suspense } from "react";
import { useTranslation } from "react-i18next";

export const PreviewScreen = () => {
  const [isPreviewOn, setPreviewMode] = usePreviewMode();
  const { t } = useTranslation();
  const previewComponent = useBuilderProp("previewComponent", null);
  if (!isPreviewOn) return null;
  return (
    <div className={cn("fixed inset-0 z-[999] bg-background builder-sdk-preview-screen", isPreviewOn ? "block" : "hidden")}>
      <Button size="sm" className="absolute right-0 top-0 m-4 space-x-2 builder-sdk-close-preview-btn" onClick={() => setPreviewMode(false)}>
        <EyeClosedIcon />
        <span>{t("Close Preview")}</span>
      </Button>
      <div>
        {previewComponent ? (
          <Suspense fallback={<Skeleton className="h-96 w-full" />}>{React.createElement(previewComponent)}</Suspense>
        ) : null}
      </div>
    </div>
  );
};
