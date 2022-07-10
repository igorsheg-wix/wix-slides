import { PlateEditor, TNode, Value, getPluginType } from "@udecode/plate-core";
import { ELEMENT_DASHMENU_INPUT } from "@wix-slides/common/types";
import { TMentionInputElement } from "../DashMenu.types";

export const isNodeMentionInput = <V extends Value>(
  editor: PlateEditor<V>,
  node: TNode
): node is TMentionInputElement => {
  return node.type === getPluginType(editor, ELEMENT_DASHMENU_INPUT);
};
