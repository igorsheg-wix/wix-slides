import React from 'react'
import { PlateEditor, Value } from '@udecode/plate'
import { useEditorTohtml } from '@wix-slides/common/hooks/useEditorToHtml'
import { Slide } from '@wix-slides/common/types'
import { pxToVw } from '@wix-slides/common/utils/calcs'
import styled from 'styled-components'
import { LexicalNode } from 'lexical'
interface SlideTemplate {
  tokens: LexicalNode[]
  editor: PlateEditor<Value>
  slideBackgroundImage: Slide['backgroundImage']
}
const CoverTemplate = ({ tokens, slideBackgroundImage }: SlideTemplate) => {
  const heading = useEditorTohtml(tokens, 'heading')
  return <Wrap slideBackgroundImage={slideBackgroundImage}>{heading()}</Wrap>
}

const Wrap = styled.div<{ slideBackgroundImage: string }>`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: url(${(p) => p.slideBackgroundImage});
  background-size: cover;

  [data-wix-slide-node='h1'] {
    font-size: ${pxToVw(54)}vw;
    line-height: ${pxToVw(66)}vw;
    width: ${pxToVw(766)}vw;
    font-weight: 700;
    text-align: center;
    min-height: ${pxToVw(1)}vw;
  }
`

export default CoverTemplate
