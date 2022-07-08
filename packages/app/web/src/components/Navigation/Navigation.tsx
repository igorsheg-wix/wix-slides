import React from "react";
import styled from "styled-components";
import Flex from "../../components/Flex";
import Padder from "../../components/Padder";

const Navigation = () => {
  const publishHandler = () => {
    fetch("/api/slide").then((x) => x.json().then((data) => console.log(data)));
  };
  return (
    <Wrap align="center" justify="space-between">
      <Padder />
      <Flex align="center">
        <button onClick={publishHandler}>Publish</button>
      </Flex>
    </Wrap>
  );
};

export default Navigation;

const Wrap = styled(Flex)`
  width: 100%;
  height: 96px;
  min-height: 96px;
  display: flex;
  padding: 60px;
  background: white;
  box-sizing: border-box;
  box-shadow: 0 1px 0 rgb(199, 199, 199);
`;
