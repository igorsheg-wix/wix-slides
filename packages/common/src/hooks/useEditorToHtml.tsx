import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { ImageNode } from "@wix-slides/lexical/src/nodes/ImageNode";
import DOMPurify from "dompurify";
import parse from "html-react-parser";
import { ElementNode, LexicalNode, ParagraphNode } from "lexical";
import { useCallback } from "react";
import { serializeToHtml } from "../utils/lexicalToHtml";

export const useEditorTohtml = (nodes: LexicalNode[], type: string) => {
  const ctxNodes = nodes.filter((n) => n.__type === type);

  const htmlString = useCallback(() => {
    if (ctxNodes) {
      const [editor] = useLexicalComposerContext();

      return editor.getEditorState().read(() => {
        const serializedNodes = serializeToHtml(ctxNodes).join("");

        return parse(
          DOMPurify.sanitize(serializedNodes, { ALLOW_DATA_ATTR: true })
        );
      });
    }
    return null;
  }, [ctxNodes]);

  return htmlString;
};

export const useEditorImage = (nodes: LexicalNode[]) => {
  // const ctxNodes: ImageNode | undefined = nodes.find((n) =>
  //   isType(editor, n, ELEMENT_IMAGE)
  // );

  // const pNode = nodes[0] as ParagraphNode;

  const htmlString = useCallback(() => {
    const [editor] = useLexicalComposerContext();

    return editor.getEditorState().read(() => {
      const getImageNode = (node: LexicalNode) => {
        switch (node.getType()) {
          case "image":
            const imageNode = node as ImageNode;
            return imageNode.getSrc();
          case "paragraph":
            const pNode = node as ParagraphNode;
            return pNode
              .getChildren()
              .map((k) => getImageNode(k))
              .join("");
          default:
            console.log("unknown type", node.getType());
            return;
        }
      };

      return nodes.map((node) => getImageNode(node)).join("");
    });
  }, [nodes]);

  return htmlString;

  // if (ctxNodes) {
  //   return ctxNodes.url;
  // } else {
  //   return "";
  // }
};
