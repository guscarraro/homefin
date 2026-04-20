import { NavLink } from 'react-router-dom'
import styled from 'styled-components'
import { FiHome, FiPlusCircle, FiDollarSign, FiTarget, FiList } from 'react-icons/fi'

const Wrapper = styled.nav`
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  bottom: 12px;
  width: calc(100% - 24px);
  max-width: 520px;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 8px;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 22px;
  padding: 10px;
  box-shadow: 0 10px 30px ${({ theme }) => theme.colors.shadow};
`

const NavItem = styled(NavLink)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  min-height: 58px;
  border-radius: 16px;
  color: ${({ theme }) => theme.colors.textSoft};
  font-size: 11px;

  &.active {
    background: ${({ theme }) => theme.colors.primarySoft};
    color: ${({ theme }) => theme.colors.text};
    font-weight: 700;
  }
`

function BottomNav() {
  return (
    <Wrapper>
      <NavItem to="/"><FiHome size={18} />Início</NavItem>
      <NavItem to="/launch"><FiPlusCircle size={18} />Lançar</NavItem>
      <NavItem to="/salaries"><FiDollarSign size={18} />Salários</NavItem>
      <NavItem to="/goals"><FiTarget size={18} />Metas</NavItem>
      <NavItem to="/entries"><FiList size={18} />Lista</NavItem>
    </Wrapper>
  )
}

export default BottomNav