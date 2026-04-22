import styled from 'styled-components'
import Card from '../common/Card'
import { useFinance } from '../../context/FinanceContext'
import { simulateGoal } from '../../utils/finance'
import { formatCurrency } from '../../utils/currency'

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-top: 14px;
`

const Block = styled.div`
  padding: 14px;
  border-radius: 16px;
  background: ${({ theme }) => theme.colors.surfaceAlt};
`

const PlanBox = styled.div`
  margin-top: 14px;
  padding: 14px;
  border-radius: 18px;
  border: 1px solid ${({ tone, theme }) => {
    if (tone === 'success') return theme.colors.success
    return theme.colors.warning
  }};
  background: ${({ tone }) => {
    if (tone === 'success') return 'rgba(34, 197, 94, 0.10)'
    return 'rgba(251, 191, 36, 0.12)'
  }};
`

function GoalCard({ goal }) {
  const { projection } = useFinance()
  const simulation = simulateGoal(goal, projection)

  return (
    <Card>
      <h3>{goal.title || 'Meta sem nome'}</h3>
      <p>Meta: {formatCurrency(goal.targetAmount)}</p>
      <p>Prazo desejado: {goal.targetMonths || 0} meses</p>

      <Grid>
        <Block>
          <strong>Precisa guardar</strong>
          <div>{formatCurrency(simulation.monthlyNeed)}/mês</div>
        </Block>

        <Block>
          <strong>Reserva viável hoje</strong>
          <div>{formatCurrency(simulation.suggestedReserve)}/mês</div>
        </Block>
      </Grid>

      {simulation.isViable ? (
        <PlanBox tone="success">
          <strong>Plano sugerido</strong>
          <p style={{ marginTop: 6 }}>
            Separando {formatCurrency(simulation.monthlyNeed)} por mês, vocês conseguem bater a meta
            dentro do prazo.
          </p>
          <p style={{ marginTop: 6 }}>
            Regra prática: aportem primeiro, deixem compras variáveis e lazer para depois.
          </p>
        </PlanBox>
      ) : (
        <PlanBox tone="warning">
          <strong>Plano sugerido</strong>
          <p style={{ marginTop: 6 }}>
            Hoje faltam {formatCurrency(simulation.gap)} por mês para bater essa meta no prazo.
          </p>
          <p style={{ marginTop: 6 }}>
            Caminho honesto: reduzir gasto variável, alongar o prazo ou baixar o valor da meta.
          </p>

          {simulation.estimatedMonths > 0 && (
            <p style={{ marginTop: 6 }}>
              No ritmo atual, essa meta ficaria mais realista em cerca de {simulation.estimatedMonths} meses.
            </p>
          )}
        </PlanBox>
      )}
    </Card>
  )
}

export default GoalCard