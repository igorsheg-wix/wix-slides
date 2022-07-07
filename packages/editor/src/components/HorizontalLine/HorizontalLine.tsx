import React from 'react'
import { PlateEditor, Value, getPreviousNode } from '@udecode/plate'
import { ElementProps, MyValue } from '@wix-slides/common/types'
import { gethrNodes } from '@wix-slides/common/utils/get-hr-nodes'
import classnames from 'classnames'
import { useFocused, useSelected } from 'slate-react'
import styles from './HorizontalLine.module.scss'

type HorizontalLineElementProps<V extends MyValue> = ElementProps<V>

export const HorizontalLineElement = <V extends MyValue>(
  props: HorizontalLineElementProps<V>
) => {
  const { attributes, children, nodeProps } = props
  const selected = useSelected()
  const focused = useFocused()

  const editor = props.editor as PlateEditor<Value>

  const hrNodes = gethrNodes(editor as PlateEditor<Value>, editor.children)
  const prevHrNode = getPreviousNode(editor, {
    match: (n) => n.type === 'hr',
  })

  const hrIndex = prevHrNode
    ? hrNodes.findIndex((h) => h[0] === prevHrNode[1][0])
    : 0

  const css = classnames(styles.hr, selected && focused && styles.selected)
  const labelCss = classnames(
    styles.hrWrap,
    selected && focused && styles.selected
  )
  return (
    <div {...attributes} {...nodeProps} data-deckster-node="hr">
      <div contentEditable={false} className={labelCss}>
        <hr className={css} contentEditable={false} />
        <span>
          <>Slide {hrIndex === 0 ? 2 : hrIndex + 1}</>
        </span>
      </div>
      {children}
    </div>
  )
}
