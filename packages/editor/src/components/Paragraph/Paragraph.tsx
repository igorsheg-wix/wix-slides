import React from "react";
import {
  Value,
  isCollapsed,
  isElementEmpty,
  useEditorState,
} from "@udecode/plate";
import { ElementProps } from "@wix-slides/common/types";
import classNames from "classnames";
import { useFocused, useSelected } from "slate-react";
import editorStyles from "../../Editor.module.scss";

interface ParagraphElementProps<V extends Value> extends ElementProps<V> {
  as?: "p" | "span";
}

export const ParagraphElement = <V extends Value>(
  props: ParagraphElementProps<V>
) => {
  const {
    attributes,
    children,
    nodeProps,
    as = "p",
    element,
    placeholder = "Type '/' to insert, or start writing…",
  } = props;

  const el = React.createElement(as, {}, ...children);

  const focused = useFocused();
  const selected = useSelected();
  const editor = useEditorState();

  const isEmptyBlock = isElementEmpty(editor, element);
  const hideOnBlur = true;

  const enabled =
    isEmptyBlock &&
    (!hideOnBlur ||
      (isCollapsed(editor.selection) && hideOnBlur && focused && selected));

  const placeholderCss = classNames(
    enabled && editorStyles.emptyBlockPlaceHolder
  );
  return (
    <div
      {...attributes}
      {...nodeProps}
      data-deckster-node={as}
      className={placeholderCss}
      data-placeholder={placeholder}
    >
      {enabled && (
        <span contentEditable={false} className={placeholderCss}>
          {placeholder}
        </span>
      )}
      {el}
    </div>
  );
};
