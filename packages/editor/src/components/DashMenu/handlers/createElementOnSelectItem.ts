import {
  PlateEditor,
  focusEditor,
  getBlockAbove,
  insertNode,
  insertText,
  isEndPoint,
  removeNodes,
  select,
  setNodes,
  withoutMergingHistory,
  withoutNormalizing,
} from '@udecode/plate'
import { ELEMENT_DASHMENU_INPUT, MenuItem } from '@wix-slides/common/types'
import { Range } from 'slate'

const createElementOnSelectItem = (
  ev: React.SyntheticEvent,
  editor: PlateEditor,
  item: MenuItem
) => {
  ev.preventDefault()
  ev.stopPropagation()
  const pathAbove = getBlockAbove(editor)?.[1]
  const isBlockEnd =
    editor.selection &&
    pathAbove &&
    isEndPoint(editor, editor.selection.anchor, pathAbove)

  withoutNormalizing(editor, () => {
    if (isBlockEnd) {
      insertText(editor, ' ')
    }

    editor.selection && select(editor, Range.start(editor.selection))

    withoutMergingHistory(editor, () =>
      removeNodes(editor, {
        match: (node) => node.type === ELEMENT_DASHMENU_INPUT,
      })
    )

    if (item.key === 'hr') {
      insertNode(editor, {
        type: item.key,
        children: [{ text: '' }],
      })

      if (editor && editor.selection) {
        //@ts-ignore
        focusEditor(editor, [editor.selection?.anchor.path[0] + 1])
      }
    } else {
      setNodes(editor, {
        type: item.key,
        children: [{ text: '' }],
      })
    }
  })
}

export default createElementOnSelectItem
