// Our Mesures
//  1vw = 16.552pt;
// 1pt  =  0.060vw

// fullView = 43.5vw == 720pt

// const vwToPoint = (vw) =>  vw * 0.060 ;
// const pxToVw = (px) => px * 0.0322;
// const pxToPoint = (px) => vwToPoint(pxToVw(px));

const figmaWidth = 1349;
const slideVw = 43.7007874;
const slidePt = 720;

export const figmaToPt = (px: number) => {
  const figmaToVw = slideVw / figmaWidth;
  const vwToPt = slidePt / slideVw;
  return px * figmaToVw * vwToPt;
};

export const pxToVw = (px: number) => {
  const figmaToVw = slideVw / figmaWidth;
  return px * figmaToVw;
};

export const decksterPxToPt = (canvasSize: number, px: number) => {
  const decksterCanvasToVw = slideVw / canvasSize;
  const vwToPt = slidePt / slideVw;
  return px * decksterCanvasToVw * vwToPt;
};

export const indices = (array: any[], pattern: string) =>
  array.reduce(function (r, v, i) {
    return r.concat(v === pattern ? i : []);
  }, []);
