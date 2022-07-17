import { PlateProvider } from "@udecode/plate";
import { DecksterEditor } from "@wix-slides/editor/src";
import styled from "styled-components";
import Flex from "../components/Flex";
import Navigation from "../components/Navigation/Navigation";
import { Viewer } from "../components/viewer";
import LexicalEditor from "@wix-slides/lexical/src/index";

const Deckster = () => {
  return (
    <Layout column>
      <Navigation />
      <Wrap>
        <EditorWrap>
          <LexicalEditor />
        </EditorWrap>
        <ViewerWrap>
          <Viewer />
        </ViewerWrap>
      </Wrap>
    </Layout>
  );
};

const Layout = styled(Flex)`
  width: 100%;
  height: 100%;
  display: flex;
`;
const ViewerWrap = styled.div`
  display: flex;
  width: 50%;
  height: 100%;
`;
const EditorWrap = styled.div`
  display: flex;
  width: 50%;
  height: 100%;
  padding: 20px;
  position: relative;
  z-index: 2;
  box-shadow: 0px 0.4px 0.5px hsl(0deg 0% 63% / 0.29),
    0px 1.1px 1.2px -0.6px hsl(0deg 0% 63% / 0.29),
    0px 2.1px 2.4px -1.2px hsl(0deg 0% 63% / 0.29),
    -0.1px 4.3px 4.8px -1.9px hsl(0deg 0% 63% / 0.29),
    -0.1px 8.3px 9.3px -2.5px hsl(0deg 0% 63% / 0.29);
`;
const Wrap = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  max-height: calc(100vh - 96px);
  flex-direction: row;
  justify-content: flex-start;
`;

export default Deckster;
