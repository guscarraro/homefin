import styled from 'styled-components'

const StyledInput = styled.input`
  width: 100%;
  height: 52px;
  border-radius: 16px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surfaceAlt};
  color: ${({ theme }) => theme.colors.text};
  padding: 0 16px;
  outline: none;
`

function Input(props) {
  return <StyledInput {...props} />
}

export default Input