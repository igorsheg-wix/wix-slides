import { PlateEditor, Value } from "@udecode/plate";

export enum Temaplte {
  cover = "cover",
  titleWithP = "titleWithP",
  titleWithPWithImage = "titleWithPWithImage"
}

export interface Slide {
  id: string;
  title: string;
  template: Temaplte;
  width: number;
  backgroundImage: string;
  elements: SlideElement[] | null;
  tokens: Value;

  html: HTMLElement[] | null;
}

export interface SlideTemplate {
  tokens: Value
  editor: PlateEditor<Value>
  slideBackgroundImage: Slide['backgroundImage']
}

export interface SlideElement {
  nodeName: string;
  text: any;
  coords: {
    top: any;
    left: any;
    width: any;
    height: any;
    bottom: any;
    right: any;
  };
  style?: {
    fontSize: number;
    lineSpacing: number;
    bold: any;
    alignment: any;
  };
}
