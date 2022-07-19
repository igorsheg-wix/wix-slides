import {
  useEditorImage,
  useEditorTohtml,
} from '@wix-slides/common/hooks/useEditorToHtml'
import { pxToVw } from '@wix-slides/common/utils/calcs'
import { LexicalNode } from 'lexical'
import styled from 'styled-components'

interface SlideTemplate {
  tokens: LexicalNode[]
}

const TitleWithParagraphWithImage = ({ tokens }: SlideTemplate) => {
  const heading = useEditorTohtml(tokens, 'heading')
  const paragraph = useEditorTohtml(tokens, 'paragraph')
  const imageSrc = useEditorImage(tokens)

  return (
    <Wrap>
      <ContentWrap>
        {heading()}
        {paragraph()}
      </ContentWrap>
      <SlideImage>
        <img src={imageSrc()} />
      </SlideImage>
    </Wrap>
  )
}

const ContentWrap = styled.div`
  width: 40%;
  height: 100%;
  display: flex;
  justify-content: center;
  box-sizing: border-box;
  flex-direction: column;
`
const SlideImage = styled.div`
  width: 60%;
  height: 100%;
  display: flex;
  justify-content: center;
  box-sizing: border-box;
  flex-direction: column;
  overflow: hidden;
  padding: ${pxToVw(80)}vw;

  img {
    height: 100%;
    object-fit: cover;
    display: block;
  }
`
const Wrap = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  box-sizing: border-box;
  flex-direction: row;

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

export default TitleWithParagraphWithImage
