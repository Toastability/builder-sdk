import { CHAI_BUILDER_EVENTS } from "@/core/events";
import { useAddBlock } from "@/core/hooks";
import { getBlocksFromHTML } from "@/core/import-html/html-to-json";
import { pubsub } from "@/core/pubsub";
import { Button } from "@/ui/shadcn/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from "@/ui/shadcn/components/ui/card";
import { Label } from "@/ui/shadcn/components/ui/label";
import { Textarea } from "@/ui/shadcn/components/ui/textarea";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const ImportHTML = ({ parentId, position }: { parentId?: string; position?: number }) => {
  const { t } = useTranslation();
  const [code, setCode] = useState("");
  const { addPredefinedBlock } = useAddBlock();

  const importComponents = () => {
    const blocks = getBlocksFromHTML(code);
    addPredefinedBlock([...blocks], parentId, position);
    setCode("");
    pubsub.publish(CHAI_BUILDER_EVENTS.CLOSE_ADD_BLOCK);
  };

  return (
    <Card className="border-border/0 p-0 shadow-none builder-sdk-import-html-panel">
      <CardHeader className="p-3">
        <CardDescription>{t("Use HTML snippets from Tailwind CSS component libraries")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 px-3 py-0">
        <div className="space-y-1">
          <Label htmlFor="current" className="text-sm">
            {t("Tailwind HTML snippet")}
          </Label>
          <Textarea
            autoFocus
            tabIndex={1}
            ref={(el) => el && el.focus()}
            onChange={(evt) => setCode(evt.target.value)}
            rows={12}
            value={code}
            placeholder={t("Enter your code snippet here")}
            className="resize-none overflow-x-auto whitespace-pre bg-background font-mono text-xs font-normal"
          />
        </div>
      </CardContent>
      <CardFooter className="flex flex-col justify-end p-3">
        <Button disabled={code.trim() === ""} onClick={() => importComponents()} size="sm" className="w-fit">
          {t("Import HTML")}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ImportHTML;
