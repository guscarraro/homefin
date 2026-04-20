import styled from 'styled-components'
import { FiChevronDown } from 'react-icons/fi'

const Wrapper = styled.div`
  position: relative;
  width: 100%;
`

const Select = styled.select`
  appearance: none;
  width: 100%;
  height: 52px;
  border-radius: 16px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surfaceAlt};
  color: ${({ theme }) => theme.colors.text};
  padding: 0 42px 0 16px;
  outline: none;
`

const IconBox = styled.div`
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  display: flex;
  align-items: center;
`

function StyledSelect({ options, value, onChange, placeholder }) {
  return (
    <Wrapper>
      <Select value={value} onChange={onChange}>
        <option value="">{placeholder}</option>
        {options.map(option => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </Select>
      <IconBox>
        <FiChevronDown />
      </IconBox>
    </Wrapper>
  )
}

export default StyledSelect