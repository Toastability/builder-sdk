import { usePageExternalData } from "@/core/atoms/builder";
import { dataBindingActiveAtom } from "@/core/atoms/ui";
import { cn } from "@/core/functions/common-functions";
import { Button } from "@/ui/shadcn/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/ui/shadcn/components/ui/tooltip";
import { useAtom } from "jotai";
import { isEmpty } from "lodash-es";
import { DatabaseZapIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

export const DataBinding = () => {
  const pageExternalData = usePageExternalData();
  const [dataBindingActive, setDataBindingActive] = useAtom(dataBindingActiveAtom);
  const { t } = useTranslation();
  if (isEmpty(pageExternalData)) return null;
  return (
    <div className="flex items-center">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button className="rounded-full" variant="link" onClick={() => setDataBindingActive(!dataBindingActive)}>
            <DatabaseZapIcon className={cn("h-4 w-4", dataBindingActive ? "text-green-500" : "text-gray-500")} />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{t("Toggle Data Binding")}</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
};
