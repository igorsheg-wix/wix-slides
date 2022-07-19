import LexicalEditor from "@wix-slides/lexical/src/index";
import styled from "styled-components";
import Flex from "../components/Flex";
import Navigation from "../components/Navigation/Navigation";
import { Viewer } from "../components/viewer";

const Deckster = () => {
  return (
    <Layout column>
      <Navigation />
      <Wrap>
        <LexicalEditor>
          <Viewer />
        </LexicalEditor>
      </Wrap>
    </Layout>
  );
};

const Layout = styled(Flex)`
  width: 100%;
  height: 100%;
  display: flex;
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
