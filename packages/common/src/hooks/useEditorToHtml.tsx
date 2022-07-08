import { ELEMENT_IMAGE, isType, PlateEditor, TElement, Value } from '@udecode/plate'
import DOMPurify from 'dompurify'
import parse from 'html-react-parser'
import { useCallback } from 'react'
import { serializeHtml } from '../utils/serializeHtml'

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

interface ImageNode extends TElement {
  url?: string
}

export const useEditorImage = (
  editor: PlateEditor<Value>,
  tokens: Value,
) => {
  const ctxNodes: ImageNode | undefined  = tokens.find((n) => isType(editor, n, ELEMENT_IMAGE))

  if (ctxNodes) {
    return ctxNodes.url
  } else {
    return  ""
  }
  
 
}
