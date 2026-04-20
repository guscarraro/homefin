import styled from 'styled-components'
import Card from '../common/Card'
import { formatCurrency } from '../../utils/currency'

const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`

const MainValue = styled.div`
  font-size: 34px;
  font-weight: 800;
  margin-top: 8px;
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
          <p>Cadastrem os salários para liberar o quanto ainda pode gastar, investir e reservar.</p>
        </Header>
      </Card>
    )
  }

  return (
    <Card>
      <Header>
        <span>Saldo livre do mês</span>
        <MainValue>{formatCurrency(projection.availableToSpend)}</MainValue>
      </Header>

      <Grid>
        <Block>
          <Label>Despesas do mês</Label>
          <Value>{formatCurrency(projection.expenses)}</Value>
        </Block>

        <Block>
          <Label>Custos fixos</Label>
          <Value>{formatCurrency(projection.fixedCosts)}</Value>
        </Block>

        <Block>
          <Label>Investimento sugerido</Label>
          <Value>{formatCurrency(projection.investmentSuggested)}</Value>
        </Block>

        <Block>
          <Label>Lazer sugerido</Label>
          <Value>{formatCurrency(projection.leisureSuggested)}</Value>
        </Block>

        <Block>
          <Label>Teto diário</Label>
          <Value>{formatCurrency(projection.dailyLimit)}</Value>
        </Block>

        <Block>
          <Label>Comida por semana</Label>
          <Value>{formatCurrency(projection.weeklyFoodLimit)}</Value>
        </Block>

        <Block>
          <Label>Próximo mês comprometido</Label>
          <Value>{formatCurrency(projection.nextMonthCommitted)}</Value>
        </Block>

        <Block>
          <Label>Parcelas no próximo mês</Label>
          <Value>{formatCurrency(projection.nextMonthInstallments)}</Value>
        </Block>
      </Grid>
    </Card>
  )
}

export default BalanceHero