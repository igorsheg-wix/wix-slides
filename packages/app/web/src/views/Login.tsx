import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Flex from "../components/Flex";
import useDecksterStore from "../stores";

const Login = () => {
  const { userInfo } = useDecksterStore();
  const navigate = useNavigate();

  const loginHandler = () => {
    window.open("/oauth/login", "_self");
  };

  useEffect(() => {
    if (userInfo) {
      navigate("/editor", { replace: true });
    }
  }, [userInfo]);

  return (
    <Wrap justify="center" align="center">
      <Content column justify="center" align="center">
        <button onClick={loginHandler}>Sign in with Google</button>
      </Content>
    </Wrap>
  );
};

const Content = styled(Flex)`
  max-width: 600px;
  h1 {
    margin: 0;
  }
  p {
    margin: 0;
    font-size: 1.618rem;
  }
`;

const Wrap = styled(Flex)`
  width: 100vw;
  height: 100vh;
`;
export default Login;
