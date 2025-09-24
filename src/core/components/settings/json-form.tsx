import { useBlockSettingComponents } from "@/core/extensions/blocks-settings";
import { useLanguages } from "@/core/hooks";
import {
  IconPickerField,
  ImagePickerField,
  LinkField,
  RowColField,
  RTEField,
  SliderField,
  SourcesField,
} from "@/core/rjsf-widgets";
import { CodeEditor } from "@/core/rjsf-widgets/code-widget";
import { CollectionFilterSortField } from "@/core/rjsf-widgets/collection-select";
import JSONFormFieldTemplate from "@/core/rjsf-widgets/json-form-field-template";
import { RepeaterBindingWidget } from "@/core/rjsf-widgets/repeater-binding";
import { useThrottledCallback } from "@react-hookz/web";
import RjForm from "@rjsf/core/lib/index.js";
import { RJSFSchema, UiSchema } from "@rjsf/utils/lib/index.js";
import validator from "@rjsf/validator-ajv8/lib/index.js";
import { take, get, set } from "lodash-es";
import { Plus } from "lucide-react";
import { memo } from "react";

type JSONFormType = {
  blockId?: string;
  formData: any;
  schema: RJSFSchema;
  uiSchema: UiSchema;
  onChange: ({ formData }: any, key?: string) => void;
};

const CustomAddButton = (props) => (
  <button {...props} className="duration absolute right-2 top-2 cursor-pointer text-blue-400 hover:text-blue-500">
    <div className="flex items-center gap-x-0.5 text-[11px] leading-tight">
      <Plus className="h-3 w-3" /> <span>Add</span>
    </div>
  </button>
);

export const JSONForm = memo(({ blockId, schema, uiSchema, formData, onChange }: JSONFormType) => {
  const { selectedLang } = useLanguages();
  const widgets = useBlockSettingComponents("widget");
  const fields = useBlockSettingComponents("field");
  const templates = useBlockSettingComponents("template");

  const throttledChange = useThrottledCallback(
    async ({ formData }: any, id?: string) => {
      // * Sanitize undefined values
      let updatedPropData = get(formData, id);
      if (updatedPropData === undefined) set(formData, id, "");

      onChange({ formData }, id);
    },
    [onChange, selectedLang],

    400, // save only every 5 seconds
  );

  return (
    <RjForm
      key={selectedLang}
      widgets={{
        richtext: RTEField,
        richtextJson: RTEJsonField,
        icon: IconPickerField,
        image: ImagePickerField,
        code: CodeEditor,
        colCount: RowColField,
        collectionSelect: CollectionFilterSortField,
        repeaterBinding: RepeaterBindingWidget,
        ...widgets,
      }}
      fields={{
        link: LinkField,
        slider: SliderField,
        sources: SourcesField,
        ...fields,
      }}
      templates={{
        FieldTemplate: JSONFormFieldTemplate,
        ButtonTemplates: {
          AddButton: CustomAddButton,
        },
        ...templates,
      }}
      idSeparator="."
      autoComplete="off"
      omitExtraData={false}
      liveOmit={false}
      liveValidate={false}
      validator={validator}
      uiSchema={uiSchema}
      schema={schema}
      formData={formData}
      onChange={({ formData: fD }, id) => {
        if (!id || blockId !== fD?._id) return;
        const prop = take(id.split("."), 2).join(".").replace("root.", "");
        throttledChange({ formData: fD }, prop);
      }}
    />
  );
});
