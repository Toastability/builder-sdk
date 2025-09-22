import { registerChaiSidebarPanel } from "@/core/main";
import { Button } from "@/ui/shadcn/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/ui/shadcn/components/ui/popover";
import { CookieIcon, ThermometerIcon } from "lucide-react";

const Panel1Button = ({ isActive, show }: { isActive: boolean; show: () => void }) => {
  return (
    <Button variant={isActive ? "default" : "link"} size="icon" onClick={show}>
      <ThermometerIcon />
    </Button>
  );
};

registerChaiSidebarPanel("panel-1", {
  panel: () => <div>Panel 1</div>,
  button: Panel1Button,
  label: "Panel 1",
  position: "top",
});

const WhenEmptyCanvasButton = ({ isActive, show }: { isActive: boolean; show: () => void }) => {
  return (
    <Button variant={isActive ? "default" : "link"} size="icon" onClick={show}>
      <ThermometerIcon />
    </Button>
  );
};

registerChaiSidebarPanel("when-empty-canvas", {
  panel: ({ close }: { close: () => void }) => (
    <div>
      WhenEmptyCanvas
      <Button onClick={close}>Close</Button>
    </div>
  ),
  icon: <CookieIcon />,
  button: WhenEmptyCanvasButton,
  label: "Cookies Panel",
  position: "bottom",
  view: "overlay",
});

registerChaiSidebarPanel("when-empty-canvas2", {
  panel: () => <div>WhenEmptyCanvas2</div>,
  icon: <CookieIcon />,
  button: WhenEmptyCanvasButton,
  label: "Cookies Panel",
  position: "bottom",
  view: "overlay",
});

const PopoverButton = () => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="link" size="icon">
          <ThermometerIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent side="right">
        <div className="p-0">
          <h4 className="font-medium leading-none">Popover Content</h4>
        </div>
      </PopoverContent>
    </Popover>
  );
};

registerChaiSidebarPanel("popover", {
  button: PopoverButton,
  label: "Popover",
  position: "bottom",
});
