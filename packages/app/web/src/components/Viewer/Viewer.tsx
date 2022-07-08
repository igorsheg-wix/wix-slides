import React, { useEffect } from "react";
import {
  Value,
  getPreviousNode,
  usePlateSelection,
  usePlateSelectors,
} from "@udecode/plate";
import { pxToVw } from "@wix-slides/common/utils/calcs";
import { gethrNodes } from "@wix-slides/common/utils/get-hr-nodes";
import SlideUtils from "@wix-slides/common/utils/slide-utils";
import { Path } from "slate";
import styled from "styled-components";
import { WixSlide } from "../../components/Slide";
import useDecksterStore from "../../stores";

const Viewer = () => {
  const editorValue = usePlateSelectors().value();
  const editor = usePlateSelectors().editor();
  const setDecksterStore = useDecksterStore((s) => s.set);
  const slides = useDecksterStore((s) => s.slides);
  const selection = usePlateSelection();

  useEffect(() => {
    if (selection && editorValue && editor) {
      const hrNodes = gethrNodes(editor, editorValue);
      const prevHrNode = getPreviousNode(editor, {
        match: (n) => n.type === "hr",
      });

      if (prevHrNode && hrNodes.length) {
        const currentSelectionHrIndex = hrNodes.findIndex(
          (h) => h[0] === prevHrNode[1][0]
        );

        setDecksterStore((s) => {
          s.cursorOnSlide = currentSelectionHrIndex;
        });
      } else {
        setDecksterStore((s) => {
          s.cursorOnSlide = 0;
        });
      }
    }
  }, [selection]);

  useEffect(() => {
    if (editor && editorValue) {
      const hrNodes = gethrNodes(editor, editorValue);

      const slideNodes = () => {
        const nodes: Record<"nodes", Value>[] = [];
        hrNodes.map((hr, index) => {
          const nextHr = (hrNodes[index + 1] || hr[0]) as Path;
          const ctxNodes = editorValue?.slice(hr[0], nextHr[0]);
          if (ctxNodes) {
            nodes.push({ nodes: ctxNodes });
          }
        });
        return nodes;
      };

      const newSlides = slideNodes().map((slide, index) => {
        return SlideUtils().create({
          title: `slide${index}`,
          id: `slide${index}`,
          tokens: slide.nodes,
        });
      });
      setDecksterStore((s) => {
        s.slides = newSlides;
      });
    }
  }, [editorValue]);

  return (
    <Wrap id="wix-slides-viewer">
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
