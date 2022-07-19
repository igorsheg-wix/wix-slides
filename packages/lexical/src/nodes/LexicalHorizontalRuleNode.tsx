import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { useLexicalNodeSelection } from '@lexical/react/useLexicalNodeSelection'
import { mergeRegister } from '@lexical/utils'
import {
  $createNodeSelection,
  $getNodeByKey,
  $getRoot,
  $getSelection,
  $isNodeSelection,
  CLICK_COMMAND,
  COMMAND_PRIORITY_LOW,
  GridSelection,
  KEY_BACKSPACE_COMMAND,
  KEY_DELETE_COMMAND,
  LexicalCommand,
  LexicalNode,
  NodeKey,
  NodeSelection,
  RangeSelection,
  SerializedLexicalNode,
} from 'lexical'

import { createCommand, DecoratorNode } from 'lexical'
import * as React from 'react'
import { useEffect } from 'react'
import joinClasses from '../utils/join-classes'
import styles from './LexicalHorizontalRuleNode.module.scss'

export type SerializedHorizontalRuleNode = SerializedLexicalNode & {
  type: 'horizontalrule'
  version: 1
}

export const INSERT_HORIZONTAL_RULE_COMMAND: LexicalCommand<void> =
  createCommand()

function HorizontalRuleComponent({
  nodeKey,
}: {
  nodeKey: NodeKey
}): JSX.Element {
  const [editor] = useLexicalComposerContext()
  const [hrIndex, setHrIndex] = React.useState(2)
  const [isSelected, setSelected, clearSelection] =
    useLexicalNodeSelection(nodeKey)
  const [selection, setSelection] = React.useState<
    RangeSelection | NodeSelection | GridSelection | null
  >(null)
  const ref = React.useRef(null)

  const onDelete = React.useCallback(
    (payload: KeyboardEvent) => {
      if (isSelected && $isNodeSelection($getSelection())) {
        const event: KeyboardEvent = payload
        event.preventDefault()
        const node = $getNodeByKey(nodeKey)
        if ($isHorizontalRuleNode(node)) {
          node.remove()
        }
        setSelected(false)
      }
      return false
    },
    [isSelected, nodeKey, setSelected]
  )

  useEffect(() => {
    editor.getEditorState().read(() => {
      const root = $getRoot()

      const ctxNodeIndex = root
        .getChildren()
        .filter((node) => node.__type === 'horizontalrule')
        .findIndex((hrNode) => hrNode.__key === nodeKey)
      setHrIndex(ctxNodeIndex === 0 ? 2 : ctxNodeIndex + 2)
    })
  }, [editor])

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        setSelection(editorState.read(() => $getSelection()))
      }),
      editor.registerCommand<MouseEvent>(
        CLICK_COMMAND,
        (payload) => {
          const event = payload

          if (event.target === ref.current) {
            if (!event.shiftKey) {
              clearSelection()
            }
            setSelected(!isSelected)
            return true
          }

          return false
        },
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(
        KEY_DELETE_COMMAND,
        onDelete,
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(
        KEY_BACKSPACE_COMMAND,
        onDelete,
        COMMAND_PRIORITY_LOW
      )
    )
  }, [clearSelection, editor, isSelected, nodeKey, setSelected])

  const isFocused = $isNodeSelection(selection) && isSelected
  const hrClasses = joinClasses(styles.hr, isFocused && styles.selected)
  const slideCounterClasses = joinClasses(
    styles.hrWrap,
    isFocused && styles['hrWrap-selected']
  )

  return (
    <>
      <div className={slideCounterClasses}>
        <hr ref={ref} className={hrClasses} />
        <span>Slide {hrIndex}</span>
      </div>
    </>
  )
}

export class HorizontalRuleNode extends DecoratorNode<JSX.Element> {
  static getType(): string {
    return 'horizontalrule'
  }

  static clone(node: HorizontalRuleNode): HorizontalRuleNode {
    return new HorizontalRuleNode(node.__key)
  }

  static importJSON(
    serializedNode: SerializedHorizontalRuleNode
  ): HorizontalRuleNode {
    return $createHorizontalRuleNode()
  }

  exportJSON(): SerializedLexicalNode {
    return {
      type: 'horizontalrule',
      version: 1,
    }
  }

  createDOM(): HTMLElement {
    const div = document.createElement('div')
    div.style.display = 'contents'
    return div
  }

  getTextContent(): '\n' {
    return '\n'
  }

  isTopLevel(): true {
    return true
  }

  updateDOM(): false {
    return false
  }

  decorate(): JSX.Element {
    return <HorizontalRuleComponent nodeKey={this.__key} />
  }
}

export function $createHorizontalRuleNode(): HorizontalRuleNode {
  return new HorizontalRuleNode()
}

export function $isHorizontalRuleNode(
  node: LexicalNode | null | undefined
): node is HorizontalRuleNode {
  return node instanceof HorizontalRuleNode
}
