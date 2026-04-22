import styled from 'styled-components'
import Card from '../common/Card'
import ExpenseForm from './ExpenseForm'
import FixedCostForm from './FixedCostForm'

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

function QuickLaunch() {
  return (
    <Card>
      <Header>
        <Title>Lançamento rápido de custos fixos</Title>
        <Subtitle>
          Aqui é sem enrolação: valor, categoria, conta e pronto. Se parcelar, o app já joga isso
          nas projeções dos próximos meses.
        </Subtitle>
      </Header>

      <FixedCostForm />
    </Card>
  )
}

export default QuickLaunch