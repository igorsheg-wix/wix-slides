import { LexicalComposer } from '@lexical/react/LexicalComposer'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { ReactElement } from 'react'
import PlaygroundNodes from './nodes/PlaygroundNodes'
import ComponentPickerPlugin from './plugins/ComponentPickerPlugin'
import HorizontalRulePlugin from './plugins/HorizontalRulePlugin'
import MarkdownShortcutPlugin from './plugins/MarkdownShortcutPlugin'
import theme from './themes/PlaygroundEditorTheme'
import ContentEditable from './ui/ContentEditable'
import Placeholder from './ui/Placeholder'
import './index.css'
import ImagesPlugin from './plugins/ImagesPlugin'

interface EditorProps {
  children: ReactElement
}
export default function Editor({ children }: EditorProps): JSX.Element {
  const initialConfig = {
    namespace: 'wix-slides-editor',
    theme: theme,
    nodes: [...PlaygroundNodes],
    readOnly: false,
    onError: console.log,
  }

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div id="editor-shell">
        <div id="editor-container">
          <RichTextPlugin
            contentEditable={<ContentEditable />}
            placeholder={<Placeholder>Enter some text...</Placeholder>}
          />
          <ImagesPlugin />
          <ComponentPickerPlugin />
          <MarkdownShortcutPlugin />
          <HorizontalRulePlugin />
          <HistoryPlugin />
        </div>
      </div>
      <div id="editor-viewer">{children}</div>
    </LexicalComposer>
  )
}
