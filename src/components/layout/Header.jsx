import { useMemo } from 'react'
import styled from 'styled-components'
import ThemeToggle from '../common/ThemeToggle'

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
  const currentUser = useMemo(() => {
    const rawUser = localStorage.getItem('user')

    if (!rawUser) {
      return null
    }

    try {
      return JSON.parse(rawUser)
    } catch {
      return null
    }
  }, [])

  return (
    <Wrapper>
      <TitleBox>
        <Title>{title}</Title>
        <Subtitle>
          Perfil atual: {currentUser?.name || currentUser?.email || 'Usuário'}
        </Subtitle>
      </TitleBox>

      <ThemeToggle />
    </Wrapper>
  )
}

export default Header