import styled from 'styled-components'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import { USERS } from '../services/mockData'
import { useUser } from '../context/UserContext'

const Wrapper = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
`

const Box = styled.div`
  width: 100%;
  max-width: 420px;
`

const Actions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 20px;
`

function WelcomePage() {
  const { chooseUser } = useUser()

  return (
    <Wrapper>
      <Box>
        <Card>
          <h1>HomeFin</h1>
          <p>Escolha o perfil deste celular.</p>

          <Actions>
            {USERS.map(user => (
              <Button key={user.id} type="button" onClick={() => chooseUser(user.id)}>
                Entrar como {user.name}
              </Button>
            ))}
          </Actions>
        </Card>
      </Box>
    </Wrapper>
  )
}

export default WelcomePage