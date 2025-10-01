/**
 * SocialLink Block
 * 
 * A specialized link block for social media links.
 * Renders as an anchor tag with proper href and target attributes.
 */

import {
  ChaiBlockComponentProps,
  ChaiStyles,
  registerChaiBlockSchema,
  StylesProp,
} from "@chaibuilder/runtime";
import { Link1Icon } from "@radix-ui/react-icons";

export type SocialLinkBlockProps = {
  styles: ChaiStyles;
  href: string;
  target: string;
  platform: string;
};

const SocialLinkBlock = (
  props: ChaiBlockComponentProps<SocialLinkBlockProps>
) => {
  const { blockProps, styles, children, href, target, inBuilder } = props;

  if (inBuilder) {
    // In builder, render as span to prevent navigation
    return (
      <span role="link" {...blockProps} {...styles}>
        {children}
      </span>
    );
  }

  return (
    <a
      href={href || "#"}
      target={target || "_blank"}
      rel={target === "_blank" ? "noopener noreferrer" : undefined}
      {...blockProps}
      {...styles}>
      {children}
    </a>
  );
};

const Config = {
  type: "SocialLink",
  label: "Social Link",
  category: "core",
  icon: Link1Icon,
  group: "basic",
  ...registerChaiBlockSchema({
    properties: {
      styles: StylesProp(
        "inline-flex items-center justify-center hover:text-primary/80 mx-1.5 text-primary transition-colors duration-300 h-[30px] w-[30px]"
      ),
      href: {
        type: "string",
        title: "URL",
        default: "#",
      },
      target: {
        type: "string",
        title: "Target",
        default: "_blank",
        enum: ["_self", "_blank"],
      },
      platform: {
        type: "string",
        title: "Platform",
        default: "",
      },
    },
  }),
  canAcceptBlock: (type: string) => type === "SocialIcon",
};

export { SocialLinkBlock as Component, Config };
