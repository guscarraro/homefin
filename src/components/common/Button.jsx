import styled from 'styled-components'

const StyledButton = styled.button`
  border: 0;
  border-radius: 8px;
  padding: 14px 18px;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 4px 14px ${({ theme }) => theme.colors.shadow};

  &:disabled {
    cursor: not-allowed;
    opacity: 0.65;
  }
`

function Button({ children, ...props }) {
  return <StyledButton {...props}>{children}</StyledButton>
}

export default Button
