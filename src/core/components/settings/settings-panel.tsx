import { FallbackError } from "@/core/components/fallback-error";
import BlockSettings from "@/core/components/settings/block-settings";
import BlockStyling from "@/core/components/settings/block-styling";
import { BlockAttributesEditor } from "@/core/components/settings/new-panel/block-attributes-editor";
import { useBuilderProp, useSelectedBlock, useSelectedStylingBlocks } from "@/core/hooks";
import { PERMISSIONS, usePermissions } from "@/core/main";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/ui/shadcn/components/ui/tabs";
import { MixerHorizontalIcon } from "@radix-ui/react-icons";
import { isEmpty, isNull, noop } from "lodash-es";
import { ChevronDown } from "lucide-react";
import React, { useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useTranslation } from "react-i18next";
import { ResetStylesButton } from "./choices/reset-all-styles";

function BlockAttributesToggle() {
  const { t } = useTranslation();
  const [showAttributes, setShowAttributes] = useState(true);
  const [stylingBlocks] = useSelectedStylingBlocks();
  if (isEmpty(stylingBlocks)) {
    return null;
  }
  return (
    <>
      <div
        onClick={() => setShowAttributes(!showAttributes)}
        className="flex cursor-pointer items-center justify-between border-t border-border py-3 text-xs font-medium hover:underline">
        <span>{t("Attributes")}</span>
        <span>
          <ChevronDown className={"h-4 w-4 text-gray-500 " + (showAttributes ? "rotate-180" : "")} />
        </span>
      </div>
      {showAttributes && <BlockAttributesEditor />}
    </>
  );
}

const SettingsPanel: React.FC = () => {
  const selectedBlock = useSelectedBlock();
  const { t } = useTranslation();
  const onErrorFn = useBuilderProp("onError", noop);
  const { hasPermission } = usePermissions();
  let isSettingsDisabled = !hasPermission(PERMISSIONS.EDIT_BLOCK);
  const isStylesDisabled = !hasPermission(PERMISSIONS.EDIT_STYLES);

  if (isNull(selectedBlock)) {
    return (
      <div className="p-4 text-center builder-sdk-settings-panel">
        <div className="space-y-4 rounded-xl p-4 text-muted-foreground">
          <MixerHorizontalIcon className="mx-auto text-3xl" />
          <h1>{t("Please select a block to edit settings or styles")}</h1>
        </div>
      </div>
    );
  }

  if (isSettingsDisabled && isStylesDisabled) {
    return (
      <div className="p-4 text-center builder-sdk-settings-panel">
        <div className="space-y-4 rounded-xl p-4 text-muted-foreground">
          <MixerHorizontalIcon className="mx-auto text-3xl" />
          <h1>{t("You don't have permission to edit settings or styles")}</h1>
          <p>{t("Please contact your administrator to get access")}</p>
        </div>
      </div>
    );
  }

  // Show only settings panel if styles are disabled
  if (isStylesDisabled) {
    return (
      <ErrorBoundary fallback={<FallbackError />} onError={onErrorFn}>
        <div className="no-scrollbar h-full max-h-min w-full overflow-y-auto builder-sdk-settings-panel">
          <BlockSettings />
          <br />
          <br />
        </div>
      </ErrorBoundary>
    );
  }

  // Show only styles panel if settings are disabled
  if (isSettingsDisabled) {
    return (
      <ErrorBoundary fallback={<FallbackError />} onError={onErrorFn}>
        <div className="no-scrollbar h-full max-h-min w-full overflow-y-auto overflow-x-hidden builder-sdk-settings-panel">
          <div className="flex w-full items-center justify-end">
            <ResetStylesButton />
          </div>
          <BlockStyling />
          <BlockAttributesToggle />
          <br />
          <br />
          <br />
        </div>
      </ErrorBoundary>
    );
  }

  // Show both tabs if both permissions are enabled
  return (
    <ErrorBoundary fallback={<FallbackError />} onError={onErrorFn}>
      <Tabs defaultValue="settings" className="flex flex-1 flex-col builder-sdk-settings-tabs">
        <div className="flex items-center justify-between">
          <TabsList className="grid h-auto w-full grid-cols-2 p-1 py-1">
            <TabsTrigger value="settings" className="text-xs">
              Settings
            </TabsTrigger>
            <TabsTrigger value="styles" className="text-xs">
              <div className="flex w-full items-center justify-between">
                <span className="w-[90%] text-center">Styles</span>
                <span className="w-[10%]">
                  <ResetStylesButton />
                </span>
              </div>
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="settings" className="no-scrollbar h-full max-h-min overflow-y-auto builder-sdk-settings-tab-settings">
          <BlockSettings />
          <br />
          <br />
        </TabsContent>
        <TabsContent
          value="styles"
          className="no-scrollbar h-full max-h-min max-w-full overflow-y-auto overflow-x-hidden builder-sdk-settings-tab-styles">
          <BlockStyling />
          <BlockAttributesToggle />
          <br />
          <br />
          <br />
        </TabsContent>
      </Tabs>
    </ErrorBoundary>
  );
};

export default SettingsPanel;
