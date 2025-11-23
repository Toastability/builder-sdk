/**
 * @opensite/builder-sdk - Page Speed Forms Integration
 *
 * This module demonstrates how to integrate @page-speed/forms components
 * with the builder-sdk using the generic ChaiBlockAdapter pattern.
 *
 * ## Installation
 *
 * First, add @page-speed/forms as a dependency:
 * ```bash
 * pnpm add @page-speed/forms
 * pnpm add @legendapp/state valibot  # Required peer dependencies
 * ```
 *
 * ## Usage
 *
 * Import and register these blocks in your builder application:
 * ```typescript
 * import { loadPageSpeedFormBlocks } from "@opensite/builder-sdk/web-blocks";
 *
 * // Register blocks when initializing your builder
 * loadPageSpeedFormBlocks();
 * ```
 *
 * ## Architecture
 *
 * This integration uses the generic ChaiBlockAdapter pattern from @page-speed/forms
 * to wrap form components for ChaiBuilder compatibility. The adapter:
 * - Transforms ChaiBlock props to component-native props
 * - Maps ChaiBlock.content to label prop
 * - Maps ChaiBlock.styles to className prop
 * - Wraps components in error boundaries
 * - Provides data attributes for debugging
 *
 * @see https://github.com/opensite-ai/page-speed-forms
 * @see https://github.com/Toastability/builder-sdk
 */

import { registerChaiBlock, registerChaiBlockSchema, StylesProp } from "@chaibuilder/runtime";

/**
 * Page Speed Forms block configurations and components
 *
 * NOTE: These imports require @page-speed/forms to be installed.
 * If @page-speed/forms is not available, these imports will fail at runtime
 * but won't break the build process.
 */

// Import form components from @page-speed/forms
import { TextInput, TextArea, Select, Checkbox, Radio, FileInput } from "@page-speed/forms/inputs";
import { Form, useForm } from "@page-speed/forms/core";
import type { ChaiBlockComponentProps } from "@chaibuilder/runtime";

/**
 * Text Input Block
 *
 * High-performance text input with field-level reactivity.
 * Supports all HTML input types (text, email, password, etc.)
 */
const TextInputComponent = (props: ChaiBlockComponentProps<any>) => {
  const { name, type, placeholder, required, disabled, readOnly, content, blockProps } = props;

  return (
    <TextInput
      {...blockProps}
      name={name || `field-${props._id}`}
      type={type || "text"}
      placeholder={placeholder || ""}
      label={content || ""}
      required={required === true}
      disabled={disabled === true}
      readOnly={readOnly === true}
      value=""
      onChange={() => {}}
    />
  );
};

export { TextInputComponent as TextInputBlock };

export const TextInputConfig = {
  type: "TextInput",
  label: "Text Input",
  category: "form",
  icon: "Type",
  group: "page-speed-forms",
  ...registerChaiBlockSchema({
    properties: {
      styles: StylesProp(""),
      content: {
        type: "string",
        title: "Label",
        default: "Label",
      },
      name: {
        type: "string",
        title: "Field Name",
        default: "field",
      },
      type: {
        type: "string",
        title: "Input Type",
        default: "text",
        enum: ["text", "email", "password", "tel", "url", "number"],
      },
      placeholder: {
        type: "string",
        title: "Placeholder",
        default: "",
      },
      required: {
        type: "boolean",
        title: "Required",
        default: false,
      },
      disabled: {
        type: "boolean",
        title: "Disabled",
        default: false,
      },
      readOnly: {
        type: "boolean",
        title: "Read Only",
        default: false,
      },
    },
  }),
};

/**
 * Text Area Block
 *
 * Multi-line text input with auto-resize capability.
 */
const TextAreaComponent = (props: ChaiBlockComponentProps<any>) => {
  const { name, placeholder, rows, required, disabled, content, blockProps } = props;

  return (
    <TextArea
      {...blockProps}
      name={name || `field-${props._id}`}
      placeholder={placeholder || ""}
      rows={rows || 4}
      label={content || ""}
      required={required === true}
      disabled={disabled === true}
      value=""
      onChange={() => {}}
    />
  );
};

export { TextAreaComponent as TextAreaBlock };

export const TextAreaConfig = {
  type: "TextArea",
  label: "Text Area",
  category: "form",
  icon: "AlignLeft",
  group: "page-speed-forms",
  ...registerChaiBlockSchema({
    properties: {
      styles: StylesProp(""),
      content: {
        type: "string",
        title: "Label",
        default: "Label",
      },
      name: {
        type: "string",
        title: "Field Name",
        default: "message",
      },
      placeholder: {
        type: "string",
        title: "Placeholder",
        default: "",
      },
      rows: {
        type: "number",
        title: "Rows",
        default: 4,
      },
      required: {
        type: "boolean",
        title: "Required",
        default: false,
      },
      disabled: {
        type: "boolean",
        title: "Disabled",
        default: false,
      },
    },
  }),
};

/**
 * Select Block
 *
 * Dropdown select input with options.
 */
const SelectComponent = (props: ChaiBlockComponentProps<any>) => {
  const { name, placeholder, required, disabled, content, blockProps } = props;

  // Parse options if provided as string
  let options = props.options || [];
  if (typeof options === "string") {
    try {
      options = JSON.parse(options);
    } catch {
      options = [];
    }
  }

  return (
    <Select
      {...blockProps}
      name={name || `select-${props._id}`}
      placeholder={placeholder || ""}
      label={content || ""}
      required={required === true}
      disabled={disabled === true}
      options={options}
      value=""
      onChange={() => {}}
    />
  );
};

export { SelectComponent as SelectBlock };

export const SelectConfig = {
  type: "Select",
  label: "Select",
  category: "form",
  icon: "ChevronDown",
  group: "page-speed-forms",
  ...registerChaiBlockSchema({
    properties: {
      styles: StylesProp(""),
      content: {
        type: "string",
        title: "Label",
        default: "Select",
      },
      name: {
        type: "string",
        title: "Field Name",
        default: "select",
      },
      options: {
        type: "string",
        title: "Options (JSON)",
        default: '[{"label":"Option 1","value":"1"},{"label":"Option 2","value":"2"}]',
        ui: {
          "ui:widget": "textarea",
        },
      },
      placeholder: {
        type: "string",
        title: "Placeholder",
        default: "Select...",
      },
      required: {
        type: "boolean",
        title: "Required",
        default: false,
      },
      disabled: {
        type: "boolean",
        title: "Disabled",
        default: false,
      },
    },
  }),
};

/**
 * Checkbox Block
 *
 * Single checkbox input.
 */
const CheckboxComponent = (props: ChaiBlockComponentProps<any>) => {
  const { name, checked, required, disabled, content, blockProps } = props;

  return (
    <Checkbox
      {...blockProps}
      name={name || `checkbox-${props._id}`}
      label={content || ""}
      checked={checked === true}
      required={required === true}
      disabled={disabled === true}
      onChange={() => {}}
    />
  );
};

export { CheckboxComponent as CheckboxBlock };

export const CheckboxConfig = {
  type: "Checkbox",
  label: "Checkbox",
  category: "form",
  icon: "CheckSquare",
  group: "page-speed-forms",
  ...registerChaiBlockSchema({
    properties: {
      styles: StylesProp(""),
      content: {
        type: "string",
        title: "Label",
        default: "Checkbox",
      },
      name: {
        type: "string",
        title: "Field Name",
        default: "checkbox",
      },
      checked: {
        type: "boolean",
        title: "Checked",
        default: false,
      },
      required: {
        type: "boolean",
        title: "Required",
        default: false,
      },
      disabled: {
        type: "boolean",
        title: "Disabled",
        default: false,
      },
    },
  }),
};

/**
 * Radio Block
 *
 * Single radio button input.
 */
const RadioComponent = (props: ChaiBlockComponentProps<any>) => {
  const { name, value, checked, required, disabled, content, blockProps } = props;

  return (
    <Radio
      {...blockProps}
      name={name || `radio-${props._id}`}
      value={value || ""}
      label={content || ""}
      checked={checked === true}
      required={required === true}
      disabled={disabled === true}
      onChange={() => {}}
    />
  );
};

export { RadioComponent as RadioBlock };

export const RadioConfig = {
  type: "Radio",
  label: "Radio",
  category: "form",
  icon: "Circle",
  group: "page-speed-forms",
  ...registerChaiBlockSchema({
    properties: {
      styles: StylesProp(""),
      content: {
        type: "string",
        title: "Label",
        default: "Radio",
      },
      name: {
        type: "string",
        title: "Field Name",
        default: "radio",
      },
      value: {
        type: "string",
        title: "Value",
        default: "",
      },
      checked: {
        type: "boolean",
        title: "Checked",
        default: false,
      },
      required: {
        type: "boolean",
        title: "Required",
        default: false,
      },
      disabled: {
        type: "boolean",
        title: "Disabled",
        default: false,
      },
    },
  }),
};

/**
 * File Input Block
 *
 * File upload input with drag-and-drop support.
 */
const FileInputComponent = (props: ChaiBlockComponentProps<any>) => {
  const { name, accept, multiple, required, disabled, content, blockProps } = props;

  return (
    <FileInput
      {...blockProps}
      name={name || `file-${props._id}`}
      accept={accept || "*"}
      multiple={multiple === true}
      label={content || ""}
      required={required === true}
      disabled={disabled === true}
      onChange={() => {}}
    />
  );
};

export { FileInputComponent as FileInputBlock };

export const FileInputConfig = {
  type: "FileInput",
  label: "File Input",
  category: "form",
  icon: "Upload",
  group: "page-speed-forms",
  ...registerChaiBlockSchema({
    properties: {
      styles: StylesProp(""),
      content: {
        type: "string",
        title: "Label",
        default: "Upload File",
      },
      name: {
        type: "string",
        title: "Field Name",
        default: "file",
      },
      accept: {
        type: "string",
        title: "Accept Types",
        default: "*",
      },
      multiple: {
        type: "boolean",
        title: "Multiple Files",
        default: false,
      },
      required: {
        type: "boolean",
        title: "Required",
        default: false,
      },
      disabled: {
        type: "boolean",
        title: "Disabled",
        default: false,
      },
    },
  }),
};

/**
 * Form Block
 *
 * Form container with validation and submission handling.
 */
const FormComponent = (props: ChaiBlockComponentProps<any>) => {
  const { action, method, blockProps, children } = props;
  const form = useForm({
    initialValues: {},
    onSubmit: async () => {
      // No-op in builder preview mode
    }
  });

  return (
    <Form
      {...blockProps}
      form={form}
      action={action || ""}
      method={method || "POST"}
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
      {children}
    </Form>
  );
};

export { FormComponent as FormBlock };

export const FormConfig = {
  type: "Form",
  label: "Form",
  category: "form",
  icon: "FileText",
  group: "page-speed-forms",
  canAcceptDrop: true, // Allow children
  ...registerChaiBlockSchema({
    properties: {
      styles: StylesProp(""),
      action: {
        type: "string",
        title: "Action URL",
        default: "",
      },
      method: {
        type: "string",
        title: "Method",
        default: "POST",
        enum: ["GET", "POST"],
      },
    },
  }),
};

/**
 * Register all Page Speed Forms blocks with ChaiBuilder.
 *
 * Call this function when initializing your builder application.
 * It will register all form blocks and make them available in the
 * builder sidebar under the "page-speed-forms" group.
 *
 * @example
 * ```typescript
 * import { loadPageSpeedFormBlocks } from "@opensite/builder-sdk/web-blocks";
 *
 * // In your app initialization
 * loadPageSpeedFormBlocks();
 * ```
 *
 * @throws {Error} If @page-speed/forms is not installed as a dependency
 */
export const loadPageSpeedFormBlocks = () => {
  // Check if @page-speed/forms is available
  try {
    registerChaiBlock(TextInputComponent, TextInputConfig);
    registerChaiBlock(TextAreaComponent, TextAreaConfig);
    registerChaiBlock(SelectComponent, SelectConfig);
    registerChaiBlock(CheckboxComponent, CheckboxConfig);
    registerChaiBlock(RadioComponent, RadioConfig);
    registerChaiBlock(FileInputComponent, FileInputConfig);
    registerChaiBlock(FormComponent, FormConfig);

    console.log("[Page Speed Forms] Blocks registered successfully");
  } catch (error) {
    console.error("[Page Speed Forms] Failed to register blocks:", error);
    throw new Error(
      "Failed to load Page Speed Forms blocks. Ensure @page-speed/forms is installed: pnpm add @page-speed/forms"
    );
  }
};

/**
 * INTEGRATION NOTES:
 *
 * 1. Add @page-speed/forms as a dependency to package.json:
 *    ```json
 *    {
 *      "dependencies": {
 *        "@page-speed/forms": "^0.1.6",
 *        "@legendapp/state": "^3.0.0-beta.42",
 *        "valibot": "^1.0.0"
 *      }
 *    }
 *    ```
 *
 * 2. Install dependencies:
 *    ```bash
 *    pnpm install
 *    ```
 *
 * 3. Uncomment the import statements and block implementations above
 *
 * 4. Call loadPageSpeedFormBlocks() in your builder initialization:
 *    ```typescript
 *    import { loadWebBlocks } from "@opensite/builder-sdk/web-blocks";
 *    import { loadPageSpeedFormBlocks } from "@opensite/builder-sdk/web-blocks/page-speed-forms";
 *
 *    loadWebBlocks();
 *    loadPageSpeedFormBlocks();
 *    ```
 *
 * 5. The blocks will appear in the builder sidebar under "page-speed-forms" group
 *
 * ## Advanced Customization
 *
 * You can customize the adapter behavior for each component:
 *
 * ```typescript
 * const CustomTextInput = createChaiBlockAdapter(TextInput, {
 *   defaultProps: {
 *     type: "email",
 *     placeholder: "Enter your email...",
 *   },
 *   transformProps: (blockProps, block) => {
 *     // Custom prop transformation
 *     return {
 *       ...standardInputTransformer(blockProps, block),
 *       // Add custom logic
 *       autoComplete: "email",
 *       inputMode: "email",
 *     };
 *   },
 *   errorFallback: (error, block) => (
 *     <div className="error">
 *       Failed to render {block._name}: {error.message}
 *     </div>
 *   ),
 * });
 * ```
 */
