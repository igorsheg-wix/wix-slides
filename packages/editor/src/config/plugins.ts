import {
  createAutoformatPlugin,
  createBlockquotePlugin,
  createBoldPlugin,
  createCodeBlockPlugin,
  createCodePlugin,
  createDndPlugin,
  createExitBreakPlugin,
  createHeadingPlugin,
  createHorizontalRulePlugin,
  createImagePlugin,
  createItalicPlugin,
  createNodeIdPlugin,
  createParagraphPlugin,
  createPlateUI,
  createRemoveEmptyNodesPlugin,
  createResetNodePlugin,
  createSelectOnBackspacePlugin,
  createSoftBreakPlugin,
  createStrikethroughPlugin,
  createSubscriptPlugin,
  createSuperscriptPlugin,
  createUnderlinePlugin,
} from "@udecode/plate";
import { createMyPlugins } from "@wix-slides/common/types";
import { createDashMenuPlugin } from "../components/DashMenu/createMentionPlugin";
import { components } from "./components";
import { CONFIG } from "./config";

const basicElements = createMyPlugins(
  [
    createBlockquotePlugin(),
    createCodeBlockPlugin(),
    createHeadingPlugin(),
    createParagraphPlugin(),
    createHorizontalRulePlugin(),
    createImagePlugin(),
  ],
  {
    components,
  }
);

const basicMarks = createMyPlugins(
  [
    createBoldPlugin(),
    createCodePlugin(),
    createItalicPlugin(),
    createStrikethroughPlugin(),
    createSubscriptPlugin(),
    createSuperscriptPlugin(),
    createUnderlinePlugin(),
  ],
  {
    components: createPlateUI(),
  }
);

const logic = createMyPlugins(
  [
    createDndPlugin(),
    createAutoformatPlugin(CONFIG.autoformat),
    createDashMenuPlugin(),
    createNodeIdPlugin(),
    createSoftBreakPlugin(CONFIG.softBreak),
    createExitBreakPlugin(CONFIG.exitBreak),
    createResetNodePlugin(CONFIG.resetBlockType),
    createRemoveEmptyNodesPlugin(),
    createSelectOnBackspacePlugin(CONFIG.selectOnBackspace),
  ],
  { components }
);

export const PLUGINS = {
  basicElements,
  basicMarks,
  logic,
};
