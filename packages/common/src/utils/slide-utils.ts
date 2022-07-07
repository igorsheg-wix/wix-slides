import { Value } from "@udecode/plate";
import { Slide, Temaplte } from "../types";

export default () => {
  return { create };
};

interface NewSlide {
  id: string;
  title: string;
  tokens: Value;
}

const create = (props: NewSlide): Slide => {
  return {
    title: props.title,
    id: props.id,
    tokens: props.tokens,
    template: Temaplte.cover,
    html: null,
    width: 0,
    backgroundImage: "",
    elements: null,
  };
};
