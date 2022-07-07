import { createPluginFactory } from '@udecode/plate-core'
import { ELEMENT_DASHMENU_INPUT } from '@wix-slides/common/types'
import { MentionPlugin } from './DashMenu.types'
import { mentionOnKeyDownHandler } from './handlers/mentionOnKeyDownHandler'
import { isSelectionInMentionInput } from './queries'
import { withMention } from './withDashMenu'

export const createDashMenuPlugin = createPluginFactory<MentionPlugin>({
  key: ELEMENT_DASHMENU_INPUT,
  isElement: true,
  isInline: true,
  handlers: {
    onKeyDown: mentionOnKeyDownHandler({ query: isSelectionInMentionInput }),
  },
  withOverrides: withMention,
  options: {
    trigger: '/',
  },

  then: (_, { key }) => ({
    options: {
      id: key,
    },
  }),
})
