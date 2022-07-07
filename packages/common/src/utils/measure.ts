// @ts-nocheck
import { decksterPxToPt } from "./calcs";

function getElementRect(element, offsetParent) {
  let top = element.offsetTop;
  let left = element.offsetLeft;

  const width = element.offsetWidth;
  const height = element.offsetHeight;

  while (element.offsetParent) {
    element = element.offsetParent;
    if (offsetParent && element === offsetParent) {
      break;
    }

    top += element.offsetTop;
    left += element.offsetLeft;
  }

  return {
    top,
    left,
    width,
    height,
    bottom: top + height,
    right: left + width,
  };
}

function getBoundingRect(element, offsetParent, scrollContainer = window) {
  const elementRect = getElementRect(element, offsetParent);
  if (scrollContainer) {
    const scrollY = scrollContainer.scrollY || scrollContainer.scrollTop || 0;
    const scrollX = scrollContainer.scrollX || scrollContainer.scrollLeft || 0;

    elementRect.top -= scrollY;
    elementRect.bottom -= scrollY;
    elementRect.left -= scrollX;
    elementRect.right -= scrollX;
  }
  return elementRect;
}

const getSlideDOMChilds = (node) => {
  const childs = document.querySelectorAll('[data-deckster="true"]');
  if (childs.length) {
    const childsArray = Array.from(childs);
    return childsArray.filter((ch) => ch.closest(`#${node.id}`));
  } else {
    return [];
  }
};

const textAlignment = {
  start: "START",
  end: "END",
  left: "START",
  right: "END",
  center: "CENTER",
};

const fontWeight = {
  "400": false,
  "500": false,
  "600": true,
  "700": true,
};

export const getSlideChildsWithMeasurement = (node, canvasWidth) => {
  const slideChilds = getSlideDOMChilds(node);

  if (!slideChilds.length) return [];

  return slideChilds.map((child) => {
    const fontSize = decksterPxToPt(
      canvasWidth || node.offsetWidth,
      parseInt(window.getComputedStyle(child).fontSize, 10)
    );
    const lineHeight = decksterPxToPt(
      canvasWidth || node.offsetWidth,
      parseInt(window.getComputedStyle(child).lineHeight, 10)
    );
    const googleSlidesLineHeight = (lineHeight / fontSize) * 100;

    return {
      nodeName: child.nodeName,
      text: child.innerText,
      coords: getBoundingRect(child, node),
      style: {
        fontSize,
        lineSpacing: googleSlidesLineHeight,
        bold: fontWeight[window.getComputedStyle(child).fontWeight],
        alignment: textAlignment[window.getComputedStyle(child).textAlign],
      },
    };
  });
};
