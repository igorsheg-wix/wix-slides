import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { HeadingNode } from "@lexical/rich-text";
import { LexicalNode, ParagraphNode, RootNode } from "lexical";
import { Temaplte } from "../types";
import dt from "./decision-tree";

const trainingData = [
  { heading: 1, paragraph: 0, image: 0, template: Temaplte.cover },
  { heading: 1, paragraph: 1, image: 0, template: Temaplte.titleWithP },
  {
    heading: 1,
    paragraph: 1,
    image: 1,
    template: Temaplte.titleWithPWithImage,
  },
];

const config = {
  trainingSet: trainingData,
  categoryAttr: "template",
};

const getPredictionSample = (nodes: LexicalNode[]) => {
  const toPredict = {
    heading: 0,
    paragraph: 0,
    image: 0,
  };
  const calcIncides = (node: LexicalNode) => {
    switch (node.getType()) {
      case "root":
        return (node as RootNode).getChildren().map((k) => calcIncides(k));
      case "heading":
        const headingNode = node as HeadingNode;
        headingNode.getChildren().map((k) => {
          toPredict.heading = toPredict.heading + 1;
          return calcIncides(k);
        });
        return;
      case "text":
        return "";
      case "paragraph":
        const paragraphNode = node as ParagraphNode;
        paragraphNode.getChildren().map((k) => {
          toPredict.paragraph = toPredict.paragraph + 1;
          return calcIncides(k);
        });
        return;
      case "image":
        toPredict.image = toPredict.image + 1;
        return;
      default:
        console.log("unknown type", node.getType());
        return "";
    }
  };
  nodes.map((node) => calcIncides(node));
  return toPredict;
};

//@ts-ignore
const decisionTree = new dt.DecisionTree(config);

export const templateEngine = (tokens: LexicalNode[]): Temaplte => {
  const [editor] = useLexicalComposerContext();

  return editor.getEditorState().read(() => {
    console.log("From template engine --->", getPredictionSample(tokens));

    return decisionTree.predict(getPredictionSample(tokens));
  });
};
