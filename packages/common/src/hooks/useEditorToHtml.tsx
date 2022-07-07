import { useCallback } from 'react'
import { PlateEditor, Value, isType } from '@udecode/plate'
import { serializeHtml } from '../utils/serializeHtml'
import DOMPurify from 'dompurify'
import parse from 'html-react-parser'

export const useEditorTohtml = (
  editor: PlateEditor<Value>,
  tokens: Value,
  type: string
) => {
  const ctxNodes = tokens.filter((n) => isType(editor, n, type))

  const htmlString = useCallback(() => {
    if (ctxNodes) {
      const serializedNodes = serializeHtml(editor, {
        nodes: ctxNodes,
        convertNewLinesToHtmlBr: true,
      })

      return parse(
        DOMPurify.sanitize(serializedNodes, { ALLOW_DATA_ATTR: true })
      )
    }
    return null
  }, [ctxNodes])

  return htmlString
}
