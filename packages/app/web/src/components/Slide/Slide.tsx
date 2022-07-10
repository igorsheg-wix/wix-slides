import React from "react";
import { usePlateSelectors } from "@udecode/plate";
import type { Slide } from "@wix-slides/common/types";
import { templateEngine } from "@wix-slides/common/utils/template-engine";
import { templates } from "@wix-slides/templates";
import scrollIntoView from "smooth-scroll-into-view-if-needed";
import useDecksterStore from "../../stores";
import styles from "./Slide.module.scss";

interface SlideProps {
  id: string;
  index: number;
  slide: Slide;
}

const WixSlide = React.memo(({ slide, index }: SlideProps) => {
  const editor = usePlateSelectors().editor();
  const cursorOnSlide = useDecksterStore((s) => s.cursorOnSlide);
  const { tokens } = slide;
  const activeSlide = index === cursorOnSlide;

  const ref = React.useCallback(
    (node: HTMLButtonElement) => {
      if (activeSlide && node) {
        scrollIntoView(node, {
          scrollMode: "if-needed",
          block: "center",
          boundary: (parent) => {
            return parent.id !== "wix-slides-dash-menu";
          },
        });
      }
    },
    [activeSlide]
  );

  const ctxTemplate = React.useCallback(() => templateEngine(tokens), [tokens]);
  const Template = templates[ctxTemplate()].render();
  const slideBackgroundImage = templates[ctxTemplate()].backgroundImage;

  return (
    <div
      className={styles.root}
      data-deckster-template={templateEngine(tokens)}
      data-deckster-slide="true"
      id={`slide${index}`}
      ref={ref as any}
    >
      <div className={styles.content}>
        {editor && (
          <Template
            slideBackgroundImage={slideBackgroundImage}
            editor={editor}
            tokens={tokens}
          />
        )}
      </div>
    </div>
  );
});

export { WixSlide };
