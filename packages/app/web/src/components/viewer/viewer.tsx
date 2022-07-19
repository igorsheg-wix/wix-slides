import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { pxToVw } from "@wix-slides/common/utils/calcs";
import { $getRoot, EditorState, LexicalEditor, LexicalNode } from "lexical";

import SlideUtils from "@wix-slides/common/utils/slide-utils";
import styled from "styled-components";
import useDecksterStore from "../../stores";
import { WixSlide } from "../Slide";
import { ImageNode } from "@wix-slides/lexical/nodes/ImageNode";

const Viewer = () => {
  const setDecksterStore = useDecksterStore((s) => s.set);
  const slides = useDecksterStore((s) => s.slides);

  const getNodesBetweenHrs = (startNode: LexicalNode, endNode: LexicalNode) =>
    startNode
      .getNodesBetween(endNode)
      .filter(
        (value) =>
          value.__key !== "root" &&
          value.__parent === "root" &&
          value.__type !== "horizontalrule"
      );

  function onChange(editorState: EditorState, editor: LexicalEditor) {
    editorState.read(() => {
      const root = $getRoot();

      console.log("Nodes --->", root.getChildren());

      const hrNodes = root
        .getChildren()
        .filter((value) => value.__type === "horizontalrule");
      const lastChild = root.getLastChild();
      const firstChild = root.getFirstChild();

      const getFirstSlide = (firstHr?: LexicalNode | undefined) => {
        const nodes = firstHr
          ? getNodesBetweenHrs(firstChild as LexicalNode, firstHr)
          : root.getChildren();

        // const imageNodex = nodes.filter((n) => n.__type === "image");

        console.log("imageNodex --->", nodes[0] ? nodes[0].__children : "non");

        return SlideUtils().create({
          title: `slide${0}`,
          id: `slide${0}`,
          tokens: nodes,
        });
      };

      if (lastChild) {
        const slidesContent = hrNodes.map((hrNode, index) => {
          const nexthr = hrNodes[index + 1];
          return getNodesBetweenHrs(hrNode, nexthr || lastChild);
        });

        const newSlides = slidesContent.map((slideNodes, index) => {
          return SlideUtils().create({
            title: `slide${index + 1}`,
            id: `slide${index + 1}`,
            tokens: slideNodes,
          });
        });

        setDecksterStore((s) => {
          s.slides = hrNodes.length
            ? [getFirstSlide(hrNodes[0]), ...newSlides]
            : [getFirstSlide()];
        });
      }
    });
  }

  return (
    <Wrap id="wix-slides-viewer">
      <OnChangePlugin onChange={onChange} />
      {!slides.length ? (
        <Empty />
      ) : (
        slides.map((slide, index) => (
          <WixSlide id={slide.id} key={slide.id} index={index} slide={slide} />
        ))
      )}
    </Wrap>
  );
};

const Empty = () => {
  return (
    <StyledEmpty>
      <span>Every legendary deck starts with a story...</span>
    </StyledEmpty>
  );
};

const StyledEmpty = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  span {
    font-size: ${pxToVw(30)}vw;
    line-height: ${pxToVw(36)}vw;
    color: grey;
    text-align: center;
  }
`;

const Wrap = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  padding: 60px;
  background: #ebebeb;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  overflow: hidden;
  overflow-y: scroll;
  scroll-behaviour: smooth;
  max-height: calc(100vh - 96px);
  flex-direction: column;
  justify-content: flex-start;
`;

export { Viewer };
