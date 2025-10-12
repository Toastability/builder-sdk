import { IconLibraryProps, IconLibraryResult, useIconLibraryComponent } from "@/core/extensions/icon-library";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/ui/shadcn/components/ui/sheet";
import { cn } from "@/core/functions/common-functions";
import { useState, type ReactNode } from "react";

type IconLibraryModalProps = {
  children: ReactNode;
  onSelect: (icon: IconLibraryResult) => void;
  /**
   * Provide the current icon so the library can display a preview or hydrate selection.
   */
  currentIcon?: Partial<IconLibraryResult> | null;
  /**
    * Optionally override the panel width.
    */
  className?: string;
  /**
   * Optional API base URL override passed to the registered library.
   */
  baseUrl?: string;
};

const IconLibraryModal = ({ children, onSelect, currentIcon, className, baseUrl }: IconLibraryModalProps) => {
  const [open, setOpen] = useState(false);
  const IconLibraryComponent = useIconLibraryComponent();

  const handleSelect: IconLibraryProps["onSelect"] = (icon) => {
    onSelect(icon);
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent
        side="right"
        className={cn(
          "flex h-full w-full max-w-none flex-col overflow-hidden border-l border-border bg-background p-0 sm:max-w-none md:w-[min(90vw,1100px)] lg:w-[960px] xl:w-[1100px]",
          className,
        )}>
        <SheetHeader className="sr-only">
          <SheetTitle>Icon library</SheetTitle>
          <SheetDescription>Browse and select an icon.</SheetDescription>
        </SheetHeader>
        {IconLibraryComponent ? (
          <IconLibraryComponent close={() => setOpen(false)} onSelect={handleSelect} currentIcon={currentIcon} baseUrl={baseUrl} />
        ) : null}
      </SheetContent>
    </Sheet>
  );
};

IconLibraryModal.displayName = "IconLibraryModal";

export default IconLibraryModal;
