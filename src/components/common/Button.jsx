import styled from 'styled-components'

const StyledButton = styled.button`
  border: 0;
  border-radius: 18px;
  padding: 14px 18px;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 10px 30px ${({ theme }) => theme.colors.shadow};
`

function Button({ children, ...props }) {
  return <StyledButton {...props}>{children}</StyledButton>
}

export default Button