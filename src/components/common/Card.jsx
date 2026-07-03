import styled from 'styled-components'

const Wrapper = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 4px 14px ${({ theme }) => theme.colors.shadow};
`

function Card({ children, ...props }) {
  return <Wrapper {...props}>{children}</Wrapper>
}

export default Card
