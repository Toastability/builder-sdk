import { WidgetProps } from "@rjsf/utils/lib/index.js";
import { useTranslation } from "react-i18next";

interface InteractiveStateConfig {
  activeIndex?: number;
  activeIndices?: number[];
  allowMultiple?: boolean;
  animation?: {
    enabled: boolean;
    duration: number;
    easing: string;
  };
}

const InteractiveStateWidget = ({ value, onChange, uiSchema }: WidgetProps) => {
  const { t } = useTranslation();
  
  const config: InteractiveStateConfig = value || {
    activeIndex: 0,
    allowMultiple: false,
    animation: {
      enabled: true,
      duration: 300,
      easing: 'ease-in-out'
    }
  };

  const handleChange = (field: string, newValue: any) => {
    onChange({
      ...config,
      [field]: newValue
    });
  };

  const handleAnimationChange = (field: string, newValue: any) => {
    onChange({
      ...config,
      animation: {
        ...config.animation,
        [field]: newValue
      }
    });
  };

  const maxItems = uiSchema?.['ui:options']?.maxItems || 10;

  return (
    <div className="interactive-state-widget space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">
          {t("Initial Open Item")}
        </label>
        <input
          type="number"
          min={-1}
          max={(maxItems as number) - 1}
          value={config.activeIndex || 0}
          onChange={(e) => handleChange('activeIndex', parseInt(e.target.value, 10))}
          className="w-full rounded-md border border-border bg-background px-3 py-1.5 text-sm"
          placeholder="-1 for all closed"
        />
        <p className="text-xs text-muted-foreground">
          {t("Set to -1 to have all items closed by default")}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="allow-multiple"
          checked={config.allowMultiple || false}
          onChange={(e) => handleChange('allowMultiple', e.target.checked)}
          className="h-4 w-4 rounded border-border"
        />
        <label htmlFor="allow-multiple" className="text-sm font-medium">
          {t("Allow Multiple Open Items")}
        </label>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="enable-animation"
            checked={config.animation?.enabled !== false}
            onChange={(e) => handleAnimationChange('enabled', e.target.checked)}
            className="h-4 w-4 rounded border-border"
          />
          <label htmlFor="enable-animation" className="text-sm font-medium">
            {t("Enable Animation")}
          </label>
        </div>

        {config.animation?.enabled && (
          <>
            <div className="ml-6 space-y-2">
              <label className="text-sm text-muted-foreground">
                {t("Duration (ms)")}
              </label>
              <input
                type="number"
                min={0}
                max={2000}
                step={50}
                value={config.animation?.duration || 300}
                onChange={(e) => handleAnimationChange('duration', parseInt(e.target.value, 10))}
                className="w-full rounded-md border border-border bg-background px-3 py-1.5 text-sm"
              />
            </div>

            <div className="ml-6 space-y-2">
              <label className="text-sm text-muted-foreground">
                {t("Easing Function")}
              </label>
              <select
                value={config.animation?.easing || 'ease-in-out'}
                onChange={(e) => handleAnimationChange('easing', e.target.value)}
                className="w-full rounded-md border border-border bg-background px-3 py-1.5 text-sm"
              >
                <option value="ease">Ease</option>
                <option value="ease-in">Ease In</option>
                <option value="ease-out">Ease Out</option>
                <option value="ease-in-out">Ease In Out</option>
                <option value="linear">Linear</option>
                <option value="cubic-bezier(0.86, 0, 0.07, 1)">Custom (Smooth)</option>
              </select>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export { InteractiveStateWidget };