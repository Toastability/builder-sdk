import { useUndoManager } from "@/core/history/use-undo-manager";
import { Button } from "@/ui/shadcn/components/ui/button";
import { ResetIcon } from "@radix-ui/react-icons";

export const UndoRedo = () => {
  const { hasUndo, hasRedo, undo, redo } = useUndoManager();
  return (
    <div className="flex items-center builder-sdk-undo-redo">
      <Button disabled={!hasUndo()} size="sm" onClick={undo as any} className="rounded-full builder-sdk-undo-btn" variant="link">
        <ResetIcon />
      </Button>
      <Button disabled={!hasRedo()} onClick={redo as any} size="sm" className="rounded-full builder-sdk-redo-btn" variant="link">
        <ResetIcon className="rotate-180 scale-y-[-1] transform" />
      </Button>
    </div>
  );
};
