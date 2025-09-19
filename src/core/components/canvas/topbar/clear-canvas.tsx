import { useBlocksStoreUndoableActions } from "@/core/history/use-blocks-store-undoable-actions";
import { useSelectedBlockIds, useSelectedStylingBlocks } from "@/core/hooks";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/ui/shadcn/components/ui/alert-dialog";
import { Button } from "@/ui/shadcn/components/ui/button";
import { EraserIcon } from "@radix-ui/react-icons";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";

export const ClearCanvas = () => {
  const { t } = useTranslation();
  const { setNewBlocks } = useBlocksStoreUndoableActions();
  const [, setIds] = useSelectedBlockIds();
  const [, setStyleIds] = useSelectedStylingBlocks();
  const clearCanvas = useCallback(() => {
    setNewBlocks([]);
    setIds([]);
    setStyleIds([]);
  }, [setNewBlocks]);

  return (
    <div className="flex items-center builder-sdk-clear-canvas">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button size="sm" variant="ghost" className="flex items-center gap-x-1 builder-sdk-clear-canvas-btn">
            <EraserIcon /> {t("Clear")}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className={"border-border builder-sdk-clear-canvas-dialog"}>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground">{t("Clear whole canvas? ")}</AlertDialogTitle>
            <AlertDialogDescription>{t("Are you sure you want to clear the page?")}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="text-foreground">{t("Cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={clearCanvas}>{t("Yes")}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
