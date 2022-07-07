import { PlateEditor, Value, findNodePath, getNodeProps } from '@udecode/plate'
import { Path } from 'slate'

export const gethrNodes = (editor: PlateEditor<Value>, editorValue: Value) => {
  const hrNodes: Array<Path> = [[0]]

  editorValue.map((node) => {
    const { type } = getNodeProps(node)
    const nodePath = findNodePath(editor, node)

    if (type === 'hr' && nodePath) {
      hrNodes.push(nodePath)
    }
  })
  return hrNodes
}
