import styled from 'styled-components'

const Wrapper = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 24px;
  padding: 18px;
  box-shadow: 0 10px 30px ${({ theme }) => theme.colors.shadow};
`

function Card({ children, ...props }) {
  return <Wrapper {...props}>{children}</Wrapper>
}

export default Card