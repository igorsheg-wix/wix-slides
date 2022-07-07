import React from 'react'
import { Value } from '@udecode/plate'
import { ElementProps } from '@wix-slides/common/types'

interface HeadingElementProps<V extends Value> extends ElementProps<V> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}

export const HeadingElement = <V extends Value>(
  props: HeadingElementProps<V>
) => {
  const { attributes, children, nodeProps, as = 'h1' } = props

  const el = React.createElement(as, {}, ...children)

  return (
    <div {...attributes} {...nodeProps} data-deckster-node={as}>
      {el}
    </div>
  )
}
