import styled from 'styled-components'
import ThemeToggle from '../common/ThemeToggle'
import { useUser } from '../../context/UserContext'

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  gap: 12px;
`

const TitleBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`

const Title = styled.h1`
  font-size: 24px;
`

const Subtitle = styled.span`
  color: ${({ theme }) => theme.colors.textSoft};
  font-size: 14px;
`

function Header({ title }) {
  const { selectedUser } = useUser()

  return (
    <Wrapper>
      <TitleBox>
        <Title>{title}</Title>
        <Subtitle>Perfil atual: {selectedUser}</Subtitle>
      </TitleBox>
      <ThemeToggle />
    </Wrapper>
  )
}

export default Header