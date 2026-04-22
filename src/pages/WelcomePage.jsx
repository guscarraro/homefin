import { useState } from 'react'
import styled from 'styled-components'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import { login } from '../services/api'

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

const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 22px;
`

const Brand = styled.h1`
  font-size: 30px;
  font-weight: 800;
`

const Subtitle = styled.p`
  color: ${({ theme }) => theme.colors.textSoft};
  line-height: 1.45;
`

const Form = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const Label = styled.label`
  font-size: 14px;
  font-weight: 700;
`

const Input = styled.input`
  width: 100%;
  min-height: 50px;
  border-radius: 16px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surfaceAlt};
  color: ${({ theme }) => theme.colors.text};
  padding: 0 14px;
  font-size: 15px;
  outline: none;
  transition: 0.2s ease;

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primarySoft};
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.textSoft};
  }
`

const ErrorText = styled.p`
  color: ${({ theme }) => theme.colors.danger};
  font-size: 14px;
  line-height: 1.4;
`

const Helper = styled.p`
  margin-top: 16px;
  color: ${({ theme }) => theme.colors.textSoft};
  font-size: 13px;
  text-align: center;
  line-height: 1.45;
`

function WelcomePage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleLogin() {
    try {
      setLoading(true)
      setError('')

      const data = await login(email, password)

      if (data?.token) {
        localStorage.setItem('token', data.token)

        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user))
        }

        window.location.href = '/'
        return
      }

      setError(data?.error || 'Login inválido.')
    } catch {
      setError('Não foi possível conectar com o servidor.')
    } finally {
      setLoading(false)
    }
  }

  function handleKeyDown(event) {
    if (event.key === 'Enter') {
      handleLogin()
    }
  }

  return (
    <Wrapper>
      <Box>
        <Card>
          <Header>
            <Brand>HomeFin</Brand>
            <Subtitle>
              Entre com seu e-mail e senha para acessar o controle financeiro.
            </Subtitle>
          </Header>

          <Form>
            <Field>
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="Digite seu e-mail"
                value={email}
                onChange={event => setEmail(event.target.value)}
                onKeyDown={handleKeyDown}
                autoComplete="email"
              />
            </Field>

            <Field>
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="Digite sua senha"
                value={password}
                onChange={event => setPassword(event.target.value)}
                onKeyDown={handleKeyDown}
                autoComplete="current-password"
              />
            </Field>

            {error ? <ErrorText>{error}</ErrorText> : null}

            <Button type="button" onClick={handleLogin} disabled={loading}>
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
          </Form>

          <Helper>
            A sessão ficará salva neste aparelho até vocês saírem manualmente.
          </Helper>
        </Card>
      </Box>
    </Wrapper>
  )
}

export default WelcomePage