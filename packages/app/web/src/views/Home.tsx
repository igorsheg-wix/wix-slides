import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Flex from "../components/Flex";
import Padder from "../components/Padder";

const Home = () => {
  const navigate = useNavigate();

  return (
    <>
      <Wrap justify="center" align="center">
        <Content column justify="center" align="center">
          <h1>Deckster</h1>
          <h5>Create a great presentation deck - story first.</h5>
          <Padder y={36} />
          <button onClick={() => navigate("/editor")}>Start creating</button>
        </Content>
      </Wrap>
    </>
  );
};

const Content = styled(Flex)`
  max-width: 600px;
  h1,
  h5 {
    margin: 0;
  }
`;

const Wrap = styled(Flex)`
  width: 100vw;
  height: 100vh;
`;
export default Home;
