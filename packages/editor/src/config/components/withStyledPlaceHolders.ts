import {
  ELEMENT_H1,
  ELEMENT_MENTION_INPUT,
  ELEMENT_PARAGRAPH,
  withPlaceholders,
} from '@udecode/plate'

export const withStyledPlaceHolders = (components: any) =>
  withPlaceholders(components, [
    {
      key: ELEMENT_H1,
      placeholder: 'Every section needs a title',
      hideOnBlur: true,
    },
    {
      key: ELEMENT_PARAGRAPH,
      placeholder: 'Type a paragraph',
      hideOnBlur: true,
    },
    {
      key: ELEMENT_MENTION_INPUT,
      placeholder: "Type '/' to insert...",
      hideOnBlur: false,
    },
  ])
