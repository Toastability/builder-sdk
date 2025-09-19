import AddBlocksPanel from "@/core/components/sidepanels/panels/add-blocks/add-blocks";
import { CHAI_BUILDER_EVENTS } from "@/core/events";
import { usePubSub } from "@/core/hooks/use-pub-sub";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/ui/shadcn/components/ui/alert-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export const AddBlocksDialog = () => {
  const { t } = useTranslation();
  const [parentId, setParentId] = useState<string>("");
  const [position, setPosition] = useState<number>(-1);
  const [open, setOpen] = useState(false);

  usePubSub(CHAI_BUILDER_EVENTS.OPEN_ADD_BLOCK, (data: { _id: string; position?: number } | undefined) => {
    setParentId(data ? data._id : null);
    setPosition(isNaN(data?.position) ? -1 : data?.position);
    setOpen(true);
  });

  usePubSub(CHAI_BUILDER_EVENTS.CLOSE_ADD_BLOCK, () => {
    setParentId("");
    setPosition(-1);
    setOpen(false);
  });

  return (
    <AlertDialog open={open} onOpenChange={() => (open ? setOpen(false) : "")}>
      <AlertDialogContent className="max-w-5xl overflow-hidden border-border">
        <AlertDialogHeader className="flex flex-row items-center justify-between">
          <AlertDialogTitle className="text-foreground">{t("Component Library")}</AlertDialogTitle>
          <button
            onClick={() => setOpen(false)}
            className="text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300">
            <Cross2Icon className="h-6 w-6" />
          </button>
        </AlertDialogHeader>
        <div className="no-scrollbar h-[500px] max-h-full overflow-hidden">
          <AddBlocksPanel parentId={parentId} position={position} showHeading={false} />
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};
