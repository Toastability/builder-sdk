/**
 * SocialIcon Block
 * 
 * A specialized icon block for social media icons.
 * Renders SVG icons with consistent sizing and styling.
 */

import React from "react";
import {
  ChaiBlockComponentProps,
  ChaiStyles,
  registerChaiBlockSchema,
  StylesProp,
} from "@chaibuilder/runtime";
import { SketchLogoIcon } from "@radix-ui/react-icons";

export type SocialIconBlockProps = {
  styles: ChaiStyles;
  icon: string;
  width: number;
  height: number;
  platform: string;
};

const SocialIconBlock = (
  props: ChaiBlockComponentProps<SocialIconBlockProps>
) => {
  const { blockProps, styles, icon, width, height } = props;

  // Inject w-[inherit] h-[inherit] classes into SVG for proper sizing
  const enhancedSvg = icon
    ? icon.replace(/<svg /g, '<svg class="w-[inherit] h-[inherit]" ')
    : "";

  return React.createElement("span", {
    ...blockProps,
    ...styles,
    style: {
      width: width ? `${width}px` : "auto",
      height: height ? `${height}px` : "auto",
    },
    dangerouslySetInnerHTML: { __html: enhancedSvg },
  });
};

const Config = {
  type: "SocialIcon",
  label: "Social Icon",
  category: "core",
  icon: SketchLogoIcon,
  group: "media",
  ...registerChaiBlockSchema({
    properties: {
      styles: StylesProp("h-[30px] w-[30px] block"),
      icon: {
        type: "string",
        title: "Icon SVG",
        default: "",
      },
      width: {
        type: "number",
        title: "Width",
        default: 30,
      },
      height: {
        type: "number",
        title: "Height",
        default: 30,
      },
      platform: {
        type: "string",
        title: "Platform",
        default: "",
      },
    },
  }),
};

export { SocialIconBlock as Component, Config };
