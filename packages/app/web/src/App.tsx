import React, { FC, useEffect } from 'react'
import { getCookie } from '@wix-slides/common/utils/cookie'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import useDecksterStore from './stores'
import Deckster from './views/Deckster'
import Home from './views/Home'
import Login from './views/Login'

const App: FC = () => {
  const { set } = useDecksterStore()

  useEffect(() => {
    fetch('/api/me').then((x) =>
      x.json().then((user) =>
        set((s) => {
          s.userInfo = user
        })
      )
    )
  }, [])

  return (
    <Wrap>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/editor"
          element={
            <RequireAuth>
              <Deckster />
            </RequireAuth>
          }
        />
      </Routes>
    </Wrap>
  )
}

function RequireAuth({ children }: { children: JSX.Element }) {
  const location = useLocation()
  const accessToken = getCookie('access_token')

  if (!accessToken) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}

const Wrap = styled.div`
  width: 100vw;
  height: 100vh;
`
export default App
