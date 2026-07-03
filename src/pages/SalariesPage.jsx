import styled from 'styled-components'
import AppShell from '../components/layout/AppShell'
import SalaryMonthForm from '../components/salary/SalaryMonthForm'
import Card from '../components/common/Card'
import { useFinance } from '../context/FinanceContext'
import { formatCurrency } from '../utils/currency'
import { getMonthlyIncomeBreakdown } from '../utils/finance'

const Stack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;

  @media (max-width: 420px) {
    grid-template-columns: 1fr;
  }
`

const PersonCard = styled(Card)`
  display: flex;
  flex-direction: column;
  gap: 10px;
`

const Label = styled.div`
  color: ${({ theme }) => theme.colors.textSoft};
  font-size: 13px;
`

const Value = styled.div`
  font-size: 22px;
  font-weight: 800;
`

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 12px;
  color: ${({ theme }) => theme.colors.textSoft};
  font-size: 14px;
`

function SalariesPage() {
  const { financeData, selectedMonth } = useFinance()
  const breakdown = getMonthlyIncomeBreakdown(financeData, selectedMonth)

  return (
    <AppShell
      title="Receitas"
      subtitle="Fixo cadastrado + recebimentos lançados por voz, Siri ou app"
      showMonthSelector
    >
      <Stack>
        <Grid>
          <PersonCard>
            <div>
              <Label>Gustavo no mês</Label>
              <Value>{formatCurrency(breakdown.totalGustavo)}</Value>
            </div>

            <Row>
              <span>Fixo cadastrado</span>
              <strong>{formatCurrency(breakdown.fixedGustavo)}</strong>
            </Row>

            <Row>
              <span>Recebido por lançamento</span>
              <strong>{formatCurrency(breakdown.variableGustavo)}</strong>
            </Row>
          </PersonCard>

          <PersonCard>
            <div>
              <Label>Marccella no mês</Label>
              <Value>{formatCurrency(breakdown.totalMarccella)}</Value>
            </div>

            <Row>
              <span>Fixo cadastrado</span>
              <strong>{formatCurrency(breakdown.fixedMarccella)}</strong>
            </Row>

            <Row>
              <span>Recebido por lançamento</span>
              <strong>{formatCurrency(breakdown.variableMarccella)}</strong>
            </Row>
          </PersonCard>
        </Grid>

        {breakdown.variableUnassigned > 0 ? (
          <Card>
            <Label>Receita sem pessoa identificada</Label>
            <Value>{formatCurrency(breakdown.variableUnassigned)}</Value>
            <Row>
              <span>Incluída no total do casal</span>
              <strong>Use “Gustavo” ou “Marcella” ao falar para separar.</strong>
            </Row>
          </Card>
        ) : null}

        <Card>
          <Label>Total de receitas do mês</Label>
          <Value>{formatCurrency(breakdown.total)}</Value>
        </Card>

        <SalaryMonthForm />
      </Stack>
    </AppShell>
  )
}

export default SalariesPage
