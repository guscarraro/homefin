import styled from 'styled-components'
import AppShell from '../components/layout/AppShell'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import { useUser } from '../context/UserContext'

const Stack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`

function SettingsPage() {
  const { clearUser } = useUser()

  function handleReset() {
    localStorage.clear()
    window.location.reload()
  }

  return (
    <AppShell title="Ajustes">
      <Stack>
        <Card>
          <h3>Perfil do aparelho</h3>
          <Button type="button" onClick={clearUser}>Trocar usuário</Button>
        </Card>

        <Card>
          <h3>Limpar tudo</h3>
          <p>Apaga os dados locais mockados deste aparelho.</p>
          <Button type="button" onClick={handleReset}>Resetar app</Button>
        </Card>
      </Stack>
    </AppShell>
  )
}

export default SettingsPage