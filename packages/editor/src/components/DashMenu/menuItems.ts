import {
  IconH1,
  IconH2,
  IconH3,
  IconLetterT,
  IconPhoto,
  IconSeparator,
} from "@tabler/icons";
import {
  ELEMENT_H1,
  ELEMENT_H2,
  ELEMENT_H3,
  ELEMENT_HR,
  ELEMENT_IMAGE,
  ELEMENT_PARAGRAPH,
} from "@udecode/plate";
import { MenuItem } from "@wix-slides/common/types";

export default function blockMenuItems(): MenuItem[] {
  return [
    {
      key: ELEMENT_PARAGRAPH,
      lable: "Text",
      keywords: "p paragraph text",
      icon: IconLetterT,
      shortcut: "^ ⇧ 1",
    },
    {
      key: ELEMENT_H1,
      lable: "Main heading",
      keywords: "h1 heading1 title",
      icon: IconH1,
      shortcut: "^ ⇧ 1",
      attrs: { level: 1 },
    },
    {
      key: ELEMENT_H2,
      lable: "Secondary heading",
      keywords: "h2 heading2",
      icon: IconH2,
      shortcut: "^ ⇧ 2",
      attrs: { level: 2 },
    },
    {
      key: ELEMENT_H3,
      lable: "Terniary heading",
      keywords: "h3 heading3",
      icon: IconH3,
      shortcut: "^ ⇧ 3",
      attrs: { level: 3 },
    },
    {
      key: "separator",
    },
    {
      key: ELEMENT_HR,
      lable: "New slide divider",
      icon: IconSeparator,
      shortcut: `⌘ _`,
      keywords: "horizontal rule break line",
    },
    {
      key: "separator",
    },
    {
      key: ELEMENT_IMAGE,
      lable: "Image",
      icon: IconPhoto,
      shortcut: `⌘ _`,
      keywords: "image media photo illustration",
    },
  ];
}
