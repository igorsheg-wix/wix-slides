import React from 'react'
import {
  Value,
  isCollapsed,
  isElementEmpty,
  useEditorState,
} from '@udecode/plate'
import { ElementProps } from '@wix-slides/common/types'
import classNames from 'classnames'
import { useFocused, useSelected } from 'slate-react'
import styled, { css } from 'styled-components'
import editorStyles from '../../Editor.module.scss'

type DashMenuElementProps<V extends Value> = ElementProps<V>

export const DashMenuElement = <V extends Value>(
  props: DashMenuElementProps<V>
) => {
  const {
    attributes,
    children,
    nodeProps,
    element,
    placeholder = 'Keep typing to filter...',
  } = props

  const hideOnBlur = true
  const focused = useFocused()
  const selected = useSelected()
  const editor = useEditorState()

  const isEmptyBlock = isElementEmpty(editor, element)

  const enabled =
    isEmptyBlock &&
    (!hideOnBlur ||
      (isCollapsed(editor.selection) && hideOnBlur && focused && selected))

  const placeholderCss = classNames(
    enabled && editorStyles.emptyBlockPlaceHolder
  )

  return (
    <Wrap
      {...attributes}
      {...nodeProps}
      placeholder={placeholder}
      isEmptyBlock={enabled}
    >
      / {children}
    </Wrap>
  )
}

const Wrap = styled.span<{ isEmptyBlock: boolean }>`
  /* overflow-wrap: break-word; */
  /* white-space: break-spaces; */
  /* font-variant-ligatures: none; */
  /* font-feature-settings: 'liga' 0; */
  ${(p) => p.isEmptyBlock && placeholder}
`
const placeholder = css`
  ::after {
    display: inline-block;
    transition: opacity 150ms ease-in-out 0s;
    content: attr(placeholder);
    pointer-events: none;
    height: 0px;
    color: rgb(143, 143, 143);
  }
`
