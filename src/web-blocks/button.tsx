import { ChaiBlockComponentProps, ChaiStyles, registerChaiBlockSchema, StylesProp } from "@chaibuilder/runtime";
import { ButtonIcon } from "@radix-ui/react-icons";
import { get, isEmpty } from "lodash-es";
import { createElement } from "react";

export type ButtonProps = {
  content: string;
  icon: string;
  iconSize: number;
  iconPos: "order-first" | "order-last";
  styles: ChaiStyles;
  link: {
    href: string;
    target: string;
  };
};

const Component = (props: ChaiBlockComponentProps<ButtonProps>) => {
  const { blockProps, iconSize, icon, content, styles, children, iconPos, link, inBuilder } = props;
  const _icon = icon;

  // Don't render content span if content is empty, whitespace-only, or just the default "Button" placeholder
  const hasRealContent = content && content.trim() && content.trim() !== "Button";

  const child = children || (
    <>
      {hasRealContent && <span data-ai-key="content">{content}</span>}
      {_icon && (
        <div
          style={{ width: iconSize + "px" }}
          className={iconPos + " " + (hasRealContent ? (iconPos === "order-first" ? "mr-2" : "ml-2") : "") || ""}
          dangerouslySetInnerHTML={{ __html: _icon }}
        />
      )}
    </>
  );

  const button = createElement(
    "button",
    {
      ...blockProps,
      ...styles,
      type: "button",
      // Use blockProps aria-label if available (for accessibility-only buttons), otherwise use content
      "aria-label": blockProps?.["aria-label"] || (hasRealContent ? content : undefined),
    },
    child,
  );

  if (!isEmpty(get(link, "href"))) {
    if (inBuilder) {
      return <span>{button}</span>;
    } else {
      return (
        <a aria-label={content} href={get(link, "href") || "/"} target={get(link, "target", "_self")}>
          {button}
        </a>
      );
    }
  }

  return button;
};

const Config = {
  type: "Button",
  description: "similar to a button element in HTML",
  label: "Button",
  category: "core",
  icon: ButtonIcon,
  group: "basic",
  ...registerChaiBlockSchema({
    properties: {
      styles: StylesProp("text-primary-foreground bg-primary px-4 py-2 rounded-lg flex items-center"),
      content: {
        type: "string",
        title: "Button label",
        default: "Button",
      },
      icon: {
        type: "string",
        title: "Icon",
        default: "",
        ui: { "ui:widget": "icon" },
      },
      iconSize: {
        type: "number",
        title: "Icon size",
        default: 16,
      },
      iconPos: {
        type: "string",
        title: "Icon position",
        default: "order-last",
        enum: ["order-first", "order-last"],
      },
      link: {
        type: "object",
        properties: {
          type: { type: "string" },
          href: { type: "string" },
          target: { type: "string" },
        },
        default: {
          type: "url",
          href: "",
          target: "_self",
        },
        ui: {
          "ui:field": "link",
        },
      },
      prefetchLink: {
        type: "boolean",
        default: false,
        title: "Prefetch Link",
      },
    },
  }),
  i18nProps: ["content"],
  aiProps: ["content"],
};
export { Component, Config };
