import { MentionPlugin, TMentionInputElement } from "@udecode/plate";
import { comboboxActions } from "@udecode/plate-combobox";
import {
  PlateEditor,
  TNode,
  TText,
  Value,
  WithPlatePlugin,
  getEditorString,
  getNodeString,
  getPlugin,
  getPointAfter,
  getPointBefore,
  getRange,
  insertNodes,
  insertText,
  setSelection,
} from "@udecode/plate-core";
import { ELEMENT_DASHMENU_INPUT } from "@wix-slides/common/types";
import { Range } from "slate";
import useDashMenuStore from "../../stores";
import {
  findMentionInput,
  isNodeMentionInput,
  isSelectionInMentionInput,
} from "./queries";
import { removeMentionInput } from "./transforms/removeMentionInput";

export const withMention = <
  V extends Value = Value,
  E extends PlateEditor<V> = PlateEditor<V>
>(
  editor: E,
  { options: { trigger, inputCreation } }: WithPlatePlugin<MentionPlugin, V, E>
) => {
  const { type } = getPlugin<Record<string, unknown>, V>(
    editor,
    ELEMENT_DASHMENU_INPUT
  );
  const dashMenu = useDashMenuStore.getState();

  const {
    apply,
    insertBreak,
    insertText: _insertText,
    deleteBackward,
    insertFragment: _insertFragment,
    insertTextData,
  } = editor;

  const stripNewLineAndTrim: (text: string) => string = (text) => {
    return text
      .split(/\r\n|\r|\n/)
      .map((line) => line.trim())
      .join("");
  };

  editor.insertFragment = (fragment) => {
    const inMentionInput = findMentionInput(editor) !== undefined;
    if (!inMentionInput) {
      return _insertFragment(fragment);
    }

    return insertText(
      editor,
      fragment.map((node) => stripNewLineAndTrim(getNodeString(node))).join("")
    );
  };

  editor.insertTextData = (data) => {
    const inMentionInput = findMentionInput(editor) !== undefined;
    if (!inMentionInput) {
      return insertTextData(data);
    }

    const text = data.getData("text/plain");
    if (!text) {
      return false;
    }

    return true;
  };

  editor.deleteBackward = (unit) => {
    const currentMentionInput = findMentionInput(editor);
    if (currentMentionInput && getNodeString(currentMentionInput[0]) === "") {
      return removeMentionInput(editor, currentMentionInput[1]);
    }

    deleteBackward(unit);
  };

  editor.insertBreak = () => {
    if (isSelectionInMentionInput(editor)) {
      return;
    }

    insertBreak();
  };

  editor.insertText = (text) => {
    if (
      !editor.selection ||
      text !== trigger ||
      isSelectionInMentionInput(editor)
    ) {
      return _insertText(text);
    }

    // Make sure a mention input is created at the beginning of line or after a whitespace
    const previousChar = getEditorString(
      editor,
      getRange(
        editor,
        editor.selection,
        getPointBefore(editor, editor.selection)
      )
    );

    const nextChar = getEditorString(
      editor,
      getRange(
        editor,
        editor.selection,
        getPointAfter(editor, editor.selection)
      )
    );

    const beginningOfLine = previousChar === "";
    const endOfLine = nextChar === "";
    const precededByWhitespace = previousChar === " ";
    const followedByWhitespace = nextChar === " ";

    if (
      (beginningOfLine || precededByWhitespace) &&
      (endOfLine || followedByWhitespace)
    ) {
      const data: TMentionInputElement = {
        type,
        children: [{ text: "" }],
        trigger,
      };
      if (inputCreation) {
        data[inputCreation.key] = inputCreation.value;
      }
      return insertNodes<TMentionInputElement>(editor, data);
    }

    return _insertText(text);
  };

  editor.apply = (operation) => {
    apply(operation);

    if (operation.type === "insert_text" || operation.type === "remove_text") {
      const currentMentionInput = findMentionInput(editor);
      if (currentMentionInput) {
        dashMenu.setText(getNodeString(currentMentionInput[0]));
      }
    } else if (operation.type === "set_selection") {
      const previousMentionInputPath = Range.isRange(operation.properties)
        ? findMentionInput(editor, { at: operation.properties })?.[1]
        : undefined;

      const currentMentionInputPath = Range.isRange(operation.newProperties)
        ? findMentionInput(editor, { at: operation.newProperties })?.[1]
        : undefined;

      if (previousMentionInputPath && !currentMentionInputPath) {
        removeMentionInput(editor, previousMentionInputPath);
      }

      if (currentMentionInputPath) {
        comboboxActions.targetRange(editor.selection);
      }
    } else if (
      operation.type === "insert_node" &&
      isNodeMentionInput(editor, operation.node as TNode)
    ) {
      if ((operation.node as TMentionInputElement).trigger !== trigger) {
        return;
      }

      const text =
        ((operation.node as TMentionInputElement).children as TText[])[0]
          ?.text ?? "";

      if (
        inputCreation === undefined ||
        operation.node[inputCreation.key] === inputCreation.value
      ) {
        // Needed for undo - after an undo a mention insert we only receive
        // an insert_node with the mention input, i.e. nothing indicating that it
        // was an undo.
        setSelection(editor, {
          anchor: { path: operation.path.concat([0]), offset: text.length },
          focus: { path: operation.path.concat([0]), offset: text.length },
        });

        dashMenu.open();
      }
    } else if (
      operation.type === "remove_node" &&
      isNodeMentionInput(editor, operation.node as TNode)
    ) {
      if ((operation.node as TMentionInputElement).trigger !== trigger) {
        return;
      }

      dashMenu.reset();
    }
  };

  return editor;
};
