import {
  FindNodeOptions,
  PlateEditor,
  Value,
  findNode,
  getPluginType,
} from '@udecode/plate-core'
import { ELEMENT_DASHMENU_INPUT } from '@wix-slides/common/types'
import { TMentionInputElement } from '../DashMenu.types'

export const findMentionInput = <V extends Value>(
  editor: PlateEditor<V>,
  options?: Omit<FindNodeOptions<V>, 'match'>
) =>
  findNode<TMentionInputElement>(editor, {
    ...options,
    match: { type: getPluginType(editor, ELEMENT_DASHMENU_INPUT) },
  })
