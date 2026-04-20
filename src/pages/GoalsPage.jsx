import styled from 'styled-components'
import AppShell from '../components/layout/AppShell'
import GoalSimulationForm from '../components/goals/GoalSimulationForm'
import GoalCard from '../components/goals/GoalCard'
import { useFinance } from '../context/FinanceContext'

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 16px;
`

function GoalsPage() {
  const { financeData } = useFinance()

  return (
    <AppShell title="Metas e planos">
      <GoalSimulationForm />

      <List>
        {financeData.goals.map(goal => (
          <GoalCard key={goal.id} goal={goal} />
        ))}
      </List>
    </AppShell>
  )
}

export default GoalsPage