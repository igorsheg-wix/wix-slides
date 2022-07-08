import {
  ELEMENT_HR,
  ELEMENT_IMAGE,
  PlateEditor,
  focusEditor,
  getBlockAbove,
  insertImage,
  insertNode,
  insertText,
  isEndPoint,
  removeNodes,
  select,
  setNodes,
  withoutMergingHistory,
  withoutNormalizing,
} from "@udecode/plate";
import {
  ELEMENT_DASHMENU_INPUT,
  MenuItem,
  MyBlockElement,
  MyImageElement,
} from "@wix-slides/common/types";
import { Range } from "slate";

const createElementOnSelectItem = (
  ev: React.SyntheticEvent,
  editor: PlateEditor,
  item: MenuItem
) => {
  ev.preventDefault();
  ev.stopPropagation();
  const pathAbove = getBlockAbove(editor)?.[1];
  const isBlockEnd =
    editor.selection &&
    pathAbove &&
    isEndPoint(editor, editor.selection.anchor, pathAbove);

  withoutNormalizing(editor, () => {
    if (isBlockEnd) {
      insertText(editor, " ");
    }

    editor.selection && select(editor, Range.start(editor.selection));

    withoutMergingHistory(editor, () =>
      removeNodes(editor, {
        match: (node) => node.type === ELEMENT_DASHMENU_INPUT,
      })
    );

    if (item.key === ELEMENT_HR) {
      insertNode(editor, {
        type: item.key,
        children: [{ text: "" }],
      });

      if (editor && editor.selection) {
        //@ts-ignore
        focusEditor(editor, [editor.selection?.anchor.path[0] + 1]);
      }
    } else if (item.key === ELEMENT_IMAGE) {
      insertImage(
        editor,
        "https://static.wixstatic.com/media/0446d4_f57f64bce0864a53b4b129619a6efc68~mv2.png/v1/fill/w_1920,h_1080,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/0446d4_f57f64bce0864a53b4b129619a6efc68~mv2.png"
      );
    } else {
      setNodes(editor, {
        type: item.key,
        children: [{ text: "" }],
      });
    }
  });
};

export default createElementOnSelectItem;
