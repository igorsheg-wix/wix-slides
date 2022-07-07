import { TElement } from '@udecode/plate-core'

export interface TMentionElement extends TElement {
  value: string
}

export interface TMentionInputElement extends TElement {
  trigger: string
}

export interface MentionPlugin {
  id?: string
  insertSpaceAfterMention?: boolean
  trigger?: string
  inputCreation?: { key: string; value: string }
}
