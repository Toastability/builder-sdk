import { useRightPanel, useSavePage } from "@/core/hooks";
import { Button } from "@/ui/shadcn/components/ui/button";
import { Eye, Paintbrush, Save } from "lucide-react";

export default function RightTop() {
  const [panel, setRightPanel] = useRightPanel();
  const { savePage, saveState } = useSavePage();
  return (
    <div className="flex items-center gap-2 rounded-lg bg-background p-2">
      <Button
        variant={panel === "theme" ? "secondary" : "link"}
        size="sm"
        className="gap-2"
        onClick={() => setRightPanel(panel !== "theme" ? "theme" : "block")}>
        <Paintbrush className="h-4 w-4" />
        Theme
      </Button>
      <a href="/preview" target="_blank" rel="noopener noreferrer">
        <Button variant="outline" size="sm" className="gap-2">
          <Eye className="h-4 w-4" />
          Preview
        </Button>
      </a>
      <Button variant="default" size="sm" className="gap-2" onClick={() => savePage(false)}>
        <Save className="h-4 w-4" />
        {saveState === "UNSAVED" ? "Draft" : "Saved"}
      </Button>
    </div>
  );
}
