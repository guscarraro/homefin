import styled from 'styled-components'
import Card from '../common/Card'
import { formatCurrency } from '../../utils/currency'

const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`

const Eyebrow = styled.span`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textSoft};
`

const MainValue = styled.div`
  font-size: 34px;
  font-weight: 800;
  margin-top: 4px;
`

const Description = styled.p`
  color: ${({ theme }) => theme.colors.textSoft};
  line-height: 1.45;
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-top: 18px;
`

const Block = styled.div`
  padding: 14px;
  border-radius: 18px;
  background: ${({ theme }) => theme.colors.surfaceAlt};
`

const Label = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textSoft};
  margin-bottom: 6px;
`

const Value = styled.div`
  font-size: 18px;
  font-weight: 700;
`

function BalanceHero({ projection }) {
  if (!projection.hasSalary) {
    return (
      <Card>
        <Header>
          <h2>Sem projeção do mês</h2>
          <Description>
            Cadastrem os salários para liberar o painel inteligente com saldo, metas, investimento e comparação entre planejado e real.
          </Description>
        </Header>
      </Card>
    )
  }

  return (
    <Card>
      <Header>
        <Eyebrow>Indicador principal do mês</Eyebrow>
        <h2>Saldo estratégico</h2>
        <MainValue>{formatCurrency(projection.availableAfterGoals)}</MainValue>
        <Description>
          Esse valor mostra o que realmente sobra depois de custos fixos, variáveis, investimentos já feitos e metas mensais.
        </Description>
      </Header>

      <Grid>
        <Block>
          <Label>Salário total</Label>
          <Value>{formatCurrency(projection.salary)}</Value>
        </Block>

        <Block>
          <Label>Comprometido no mês</Label>
          <Value>{formatCurrency(projection.expenses + projection.investments)}</Value>
        </Block>

        <Block>
          <Label>Meta mensal para objetivos</Label>
          <Value>{formatCurrency(projection.monthlyGoalsNeed)}</Value>
        </Block>

        <Block>
          <Label>Próximo mês já comprometido</Label>
          <Value>{formatCurrency(projection.nextMonthCommitted)}</Value>
        </Block>
      </Grid>
    </Card>
  )
}

export default BalanceHero