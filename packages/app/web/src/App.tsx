import { FC, useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import styled from "styled-components";
import useDecksterStore from "./stores";
import Deckster from "./views/Deckster";
import Home from "./views/Home";
import Login from "./views/Login";

const App: FC = () => {
  return (
    <Wrap>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/editor"
          element={
            // <RequireAuth>
            <Deckster />
            // </RequireAuth>
          }
        />
      </Routes>
    </Wrap>
  );
};

function RequireAuth({ children }: { children: JSX.Element }) {
  const location = useLocation();
  const set = useDecksterStore((s) => s.set);
  const userInfo = useDecksterStore((s) => s.userInfo);

  useEffect(() => {
    fetch("/api/me").then((x) =>
      x.json().then((user) =>
        set((s) => {
          s.userInfo = user;
        })
      )
    );
  }, []);

  if (!userInfo) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

const Wrap = styled.div`
  width: 100vw;
  height: 100vh;
`;
export default App;
