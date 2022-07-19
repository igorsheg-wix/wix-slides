import { LinkNode } from "@lexical/link";
import { ListNode, ListItemNode } from "@lexical/list";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { LexicalNode, ParagraphNode, RootNode } from "lexical";
import { ImageNode } from "@wix-slides/lexical/src/nodes/ImageNode";
export function serializeToHtml(nodes: LexicalNode[]) {
  const renderText = (node) => {
    switch (node.getFormat()) {
      case 1: // bold
        return `<strong>${node.getTextContent()}</strong>`;
      case 1 << 1: // italic
        return `<em>${node.getTextContent()}</em>`;
      case 1 << 2: // strikethrough
        return `<s>${node.getTextContent()}</s>`;
      case 1 << 3: // underline
        return `<u>${node.getTextContent()}</u>`;
      case 1 << 4: // code
        return `<code>${node.getTextContent()}</code>`;
      case 1 << 5: // subscript
        return `<sub>${node.getTextContent()}</sub>`;
      case 1 << 6: // superscript
        return `<sup>${node.getTextContent()}</sup>`;
      default:
        return node.getTextContent();
    }
  };

  const renderStyle = (format) => {
    switch (format) {
      case 1: // left
        return `text-align: left;`;
      case 2: // center
        return `text-align: center;`;
      case 3: // right
        return `text-align: right;`;
      case 4: // justify
        return `text-align: justify;`;
      default: // justify
        console.log("unknown text-align", format);
        return ``;
    }
  };

  const renderNode = (node: LexicalNode) => {
    switch (node.getType()) {
      case "root":
        return (node as RootNode)
          .getChildren()
          .map((k) => renderNode(k))
          .join("");
      case "heading":
        const headingNode = node as HeadingNode;
        return `<${headingNode.getTag()} data-wix-slide-node=${headingNode.getTag()}>${headingNode
          .getChildren()
          .map((k) => renderNode(k))
          .join("")}</${headingNode.getTag()}>`;
      case "list":
        const listNode = node as ListNode;
        return `<${listNode.getTag()}>${listNode
          .getChildren()
          .map((k) => renderNode(k))
          .join("")}</${listNode.getTag()}>`;
      case "text":
        return renderText(node);
      case "quote":
        const quoteNode = node as QuoteNode;
        return `<blockquote>${quoteNode
          .getChildren()
          .map((k) => renderNode(k))
          .join("")}</blockquote>`;
      case "paragraph":
        const paragraphNode = node as ParagraphNode;
        return `<p${
          paragraphNode.getFormat()
            ? ` style="${renderStyle(paragraphNode.getFormat())}"`
            : ``
        }
        data-wix-slide-node=${paragraphNode.getType()}
        >${paragraphNode
          .getChildren()
          .map((k) => renderNode(k))
          .join("")}</p>`;
      case "listitem":
        const listItemNode = node as ListItemNode;
        return `<li>${listItemNode
          .getChildren()
          .map((k) => renderNode(k))
          .join("")}</li>`;
      case "link":
        const linkNode = node as LinkNode;
        return `<a href="${linkNode.getURL()}">${linkNode
          .getChildren()
          .map((k) => renderNode(k))
          .join("")}</a>`;
      case "linebreak":
        return `<br />`;
      // case "image":
      //   const ImageNode = node as ImageNode;
      //   return `<img src="${ImageNode.getSrc()}" />`;
      default:
        console.log("unknown type", node.getType());
        return "";
    }
  };

  return nodes.map((node) => renderNode(node));
}
