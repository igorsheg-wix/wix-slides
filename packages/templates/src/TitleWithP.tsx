import React from 'react'
import { PlateEditor, Value } from '@udecode/plate'
import { useEditorTohtml } from '@wix-slides/common/hooks/useEditorToHtml'
import { pxToVw } from '@wix-slides/common/utils/calcs'
import styled from 'styled-components'

interface SlideTemplate {
  tokens: Value
  editor: PlateEditor<Value>
}

const TitleAndParagraph = ({ tokens, editor }: SlideTemplate) => {
  const heading = useEditorTohtml(editor, tokens, 'h1')
  const paragraph = useEditorTohtml(editor, tokens, 'p')

  return (
    <Wrap>
      {heading()}
      {paragraph()}
    </Wrap>
  )
}

const Wrap = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  box-sizing: border-box;
  flex-direction: column;

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin-left: ${pxToVw(80)}vw;
    margin-bottom: ${pxToVw(20)}vw;
  }

  h1 {
    margin-left: ${pxToVw(80)}vw;
    font-size: ${pxToVw(45)}vw;
    line-height: ${pxToVw(54)}vw;
    font-weight: 700;
    width: ${pxToVw(766)}vw;
    min-height: ${pxToVw(1)}vw;
  }
  p {
    font-size: ${pxToVw(21)}vw;
    line-height: ${pxToVw(30)}vw;
    font-weight: 400;
    width: ${pxToVw(766)}vw;
    margin-left: ${pxToVw(80)}vw;
  }
`

export default TitleAndParagraph
