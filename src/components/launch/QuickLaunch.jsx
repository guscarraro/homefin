import { useState } from 'react'
import styled from 'styled-components'
import Card from '../common/Card'
import ExpenseForm from './ExpenseForm'
import FixedCostForm from './FixedCostForm'
import SmartLaunch from './SmartLaunch'

const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 16px;
`

const Title = styled.h3`
  font-size: 22px;
`

const Subtitle = styled.p`
  color: ${({ theme }) => theme.colors.textSoft};
  line-height: 1.4;
`

const Switch = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  background: ${({ theme }) => theme.colors.surfaceAlt};
  padding: 6px;
  border-radius: 8px;
  margin-bottom: 18px;
`

const SwitchButton = styled.button`
  border: 0;
  border-radius: 6px;
  min-height: 42px;
  font-weight: 700;
  cursor: pointer;
  transition: 0.2s ease;
  background: ${({ active, theme }) =>
    active ? theme.colors.primary : 'transparent'};
  color: ${({ active, theme }) => (active ? '#fff' : theme.colors.text)};
`

function QuickLaunch() {
  const [mode, setMode] = useState('smart')

  return (
    <Card>
      <Header>
        <Title>Lançamento rápido</Title>
        <Subtitle>
          Fale, digite ou use o formulário manual. O app confirma antes de salvar.
        </Subtitle>
      </Header>

      <Switch>
        <SwitchButton
          type="button"
          active={mode === 'smart' ? 1 : 0}
          onClick={() => setMode('smart')}
        >
          Voz
        </SwitchButton>

        <SwitchButton
          type="button"
          active={mode === 'expense' ? 1 : 0}
          onClick={() => setMode('expense')}
        >
          Despesa
        </SwitchButton>

        <SwitchButton
          type="button"
          active={mode === 'fixed' ? 1 : 0}
          onClick={() => setMode('fixed')}
        >
          Fixo
        </SwitchButton>
      </Switch>

      {mode === 'smart' ? <SmartLaunch /> : null}
      {mode === 'expense' ? <ExpenseForm /> : null}
      {mode === 'fixed' ? <FixedCostForm /> : null}
    </Card>
  )
}

export default QuickLaunch
