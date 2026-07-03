import styled from 'styled-components'
import { useState } from 'react'
import AppShell from '../components/layout/AppShell'
import Card from '../components/common/Card'
import Button from '../components/common/Button'

const Stack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`

const CardText = styled.p`
  color: ${({ theme }) => theme.colors.textSoft};
  line-height: 1.45;
  margin: 8px 0 14px;
`

const DangerButton = styled(Button)`
  background: ${({ theme }) => theme.colors.danger};
`

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: rgba(15, 23, 42, 0.55);
  display: flex;
  align-items: flex-end;
  justify-content: center;
`

const Sheet = styled.div`
  width: 100%;
  max-width: 520px;
  border-radius: 16px 16px 0 0;
  background: ${({ theme }) => theme.colors.surface};
  padding: 18px;
  box-shadow: 0 -10px 30px ${({ theme }) => theme.colors.shadow};
`

const SheetActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 16px;
`

function SettingsPage() {
  const [confirmReset, setConfirmReset] = useState(false)

  function handleLogout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.location.href = '/'
  }

  function handleReset() {
    localStorage.clear()
    window.location.href = '/'
  }

  return (
    <AppShell title="Ajustes">
      <Stack>
        <Card>
          <h3>Perfil do aparelho</h3>
          <CardText>Sair desta conta para entrar com outro usuário.</CardText>
          <Button type="button" onClick={handleLogout}>Sair da conta</Button>
        </Card>

        <Card>
          <h3>Limpar tudo</h3>
          <CardText>
            Limpa sessão, mês selecionado e preferências locais deste aparelho. Os dados salvos no backend não são apagados.
          </CardText>
          <DangerButton type="button" onClick={() => setConfirmReset(true)}>Resetar app</DangerButton>
        </Card>
      </Stack>

      {confirmReset ? (
        <Overlay onClick={() => setConfirmReset(false)}>
          <Sheet onClick={event => event.stopPropagation()}>
            <h3>Resetar este aparelho?</h3>
            <CardText>
              Isso só limpa dados locais e sessão deste celular. Os lançamentos salvos continuam no servidor.
            </CardText>

            <SheetActions>
              <DangerButton type="button" onClick={handleReset}>Sim, resetar</DangerButton>
              <Button type="button" onClick={() => setConfirmReset(false)}>Cancelar</Button>
            </SheetActions>
          </Sheet>
        </Overlay>
      ) : null}
    </AppShell>
  )
}

export default SettingsPage
