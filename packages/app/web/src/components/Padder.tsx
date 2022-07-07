import React, { FC } from 'react'
import styled from 'styled-components'

interface Props {
  x?: number | string
  y?: number | string
}

const Padder: FC<Props> = ({ ...props }) => {
  return <StyledPadder {...props} />
}

const StyledPadder = styled.span<Props>`
  z-index: -1;
  display: block;
  position: relative;
  user-select: none;
  min-height: ${(p) =>
    p.y && !isNaN(p.y as number) ? `${p.y}px` : isNaN(p.y as number) ? p.y : 0};

  min-width: ${(p) =>
    p.x && !isNaN(p.x as number) ? `${p.x}px` : isNaN(p.x as number) ? p.x : 0};
`

export default Padder
