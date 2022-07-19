import {Slide, Temaplte} from "../types";
import {LexicalNode} from "lexical";

export default () => {
    return {create};
};

interface NewSlide {
    id: string;
    title: string;
    tokens: LexicalNode[];
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
