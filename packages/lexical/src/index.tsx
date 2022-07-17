/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin'
import { AutoScrollPlugin } from '@lexical/react/LexicalAutoScrollPlugin'
import { CharacterLimitPlugin } from '@lexical/react/LexicalCharacterLimitPlugin'
import { CheckListPlugin } from '@lexical/react/LexicalCheckListPlugin'
import { ClearEditorPlugin } from '@lexical/react/LexicalClearEditorPlugin'
import { HashtagPlugin } from '@lexical/react/LexicalHashtagPlugin'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin'
import { ListPlugin } from '@lexical/react/LexicalListPlugin'
import { PlainTextPlugin } from '@lexical/react/LexicalPlainTextPlugin'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { TablePlugin } from '@lexical/react/LexicalTablePlugin'
import * as React from 'react'
import { useEffect, useRef } from 'react'

import { isDevPlayground, useSettings } from './context/SettingsContext'
import { SharedAutocompleteContext } from './context/SharedAutocompleteContext'
import {
  SharedHistoryContext,
  useSharedHistoryContext,
} from './context/SharedHistoryContext'
import ActionsPlugin from './plugins/ActionsPlugin'
import AutocompletePlugin from './plugins/AutocompletePlugin'
import AutoLinkPlugin from './plugins/AutoLinkPlugin'
import ClickableLinkPlugin from './plugins/ClickableLinkPlugin'
import CodeActionMenuPlugin from './plugins/CodeActionMenuPlugin'
import CodeHighlightPlugin from './plugins/CodeHighlightPlugin'
import ComponentPickerPlugin from './plugins/ComponentPickerPlugin'
import EmojisPlugin from './plugins/EmojisPlugin'
import EquationsPlugin from './plugins/EquationsPlugin'
import HorizontalRulePlugin from './plugins/HorizontalRulePlugin'
import ImagesPlugin from './plugins/ImagesPlugin'
import KeywordsPlugin from './plugins/KeywordsPlugin'
import ListMaxIndentLevelPlugin from './plugins/ListMaxIndentLevelPlugin'
import MarkdownShortcutPlugin from './plugins/MarkdownShortcutPlugin'
import { MaxLengthPlugin } from './plugins/MaxLengthPlugin'
import MentionsPlugin from './plugins/MentionsPlugin'
import PasteLogPlugin from './plugins/PasteLogPlugin'
import PollPlugin from './plugins/PollPlugin'
import SpeechToTextPlugin from './plugins/SpeechToTextPlugin'
import TabFocusPlugin from './plugins/TabFocusPlugin'
import TableCellActionMenuPlugin from './plugins/TableActionMenuPlugin'
import TableCellResizer from './plugins/TableCellResizer'
import TestRecorderPlugin from './plugins/TestRecorderPlugin'
import TextFormatFloatingToolbarPlugin from './plugins/TextFormatFloatingToolbarPlugin'
import ToolbarPlugin from './plugins/ToolbarPlugin'
import TreeViewPlugin from './plugins/TreeViewPlugin'
import TwitterPlugin from './plugins/TwitterPlugin'
import TypingPerfPlugin from './plugins/TypingPerfPlugin'
import YouTubePlugin from './plugins/YouTubePlugin'
import ContentEditable from './ui/ContentEditable'
import Placeholder from './ui/Placeholder'
import { LexicalComposer } from '@lexical/react/LexicalComposer'
import PlaygroundNodes from './nodes/PlaygroundNodes'
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin'
import './index.css'
import theme from './themes/PlaygroundEditorTheme'
import {
  $getNodeByKey,
  $getRoot,
  $getSelection,
  $parseSerializedNode,
  $nodesOfType,
  $createRangeSelection,
  NodeSelection,
  $createNodeSelection,
  EditorState,
  LexicalEditor,
} from 'lexical'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { $generateHtmlFromNodes } from '@lexical/html'

export default function Editor(): JSX.Element {
  const initialConfig = {
    namespace: 'wix-slides-editor',
    theme: theme,
    nodes: [...PlaygroundNodes],
    readOnly: false,
    onError: console.log,
  }

  function onChange(editorState: EditorState, editor: LexicalEditor) {
    editor.update(() => {
      const hNodes = $getRoot()
        .getChildren()
        .filter((n) => n.__type === 'heading')

      const wow = $createNodeSelection().add('3')
      console.log(wow)

      // if (hNodes && hNodes.length) {
      // const htmlString = $generateHtmlFromNodes(
      //   editor,
      //   $createRangeSelection().extract()
      // )

      //   console.log(hNodes[0].createDOM(initialConfig, editor))
      // }
    })
    // editorState.read(() => {
    //   // Read the contents of the EditorState here.
    //   const root = $getRoot()
    //   const selection = $getSelection()
    //   const htmlString = $generateHtmlFromNodes(editor, null)
    //   console.log(htmlString)
    // })
  }

  // const editor = createEditor(initialConfig)
  // const contentEditableElement = document.getElementById('editor')

  // React.useEffect(() => {
  //   if (contentEditableElement) {
  //     console.log(contentEditableElement)

  //     editor.setRootElement(contentEditableElement)
  //   }
  // }, [contentEditableElement])

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="editor-shell">
        <div className="editor-container">
          <RichTextPlugin
            contentEditable={<ContentEditable />}
            placeholder={<Placeholder>Enter some text...</Placeholder>}
          />
          <OnChangePlugin onChange={onChange} />
          <ComponentPickerPlugin />
          <MarkdownShortcutPlugin />
          <HorizontalRulePlugin />
          <HistoryPlugin />
        </div>
      </div>
    </LexicalComposer>
  )
}
