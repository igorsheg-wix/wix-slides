import DOMPurify from "dompurify";
import { marked } from "marked";

const markedRenderer = {
  heading(text: string, level: number) {
    return `
            <h${level} data-deckster="true">
              ${text}
            </h${level}>`;
  },
  paragraph(text: string) {
    return `
            <p data-deckster="true">
              ${text}
            </p>`;
  },
};

marked.setOptions({
  breaks: true,
  gfm: true,
  sanitizer: DOMPurify.sanitize,
});
marked.use({ renderer: markedRenderer });

export { marked };
