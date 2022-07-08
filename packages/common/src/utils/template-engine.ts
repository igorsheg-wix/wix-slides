import { Value } from "@udecode/plate";
import { Temaplte } from "../types";
import { indices } from "./calcs";
import dt from "./decision-tree";


const trainingData = [
  { h1: 1, p: 0, img: 0, template: Temaplte.cover },
  { h1: 1, p: 1, img: 0, template: Temaplte.titleWithP },
  { h1: 1, p: 1, img: 1, template: Temaplte.titleWithPWithImage },

];

const config = {
  trainingSet: trainingData,
  categoryAttr: "template",
};

//@ts-ignore
const decisionTree = new dt.DecisionTree(config);

export const templateEngine = (tokens: Value): Temaplte => {
  const tokensToPredict = {
    h1: indices(
      tokens.map((t) => t.type),
      "h1"
    ).length,
    p: indices(
      tokens.map((t) => t.type),
      "p"
    ).length,
    img: indices(
      tokens.map((t) => t.type),
      "img"
    ).length,
  };
  console.log("Prediction", decisionTree.predict(tokensToPredict));
  

  return decisionTree.predict(tokensToPredict);
};
