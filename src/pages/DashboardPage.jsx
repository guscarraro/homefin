import styled from 'styled-components'
import AppShell from '../components/layout/AppShell'
import BalanceHero from '../components/dashboard/BalanceHero'
import SpendingDonut from '../components/dashboard/SpendingDonut'
import SuggestionsCard from '../components/dashboard/SuggestionsCard'
import QuickLaunch from '../components/launch/QuickLaunch'
import { useFinance } from '../context/FinanceContext'

const Grid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`

function DashboardPage() {
  const { projection, selectedMonth } = useFinance()

  return (
    <AppShell
      title="Resumo do mês"
      subtitle={`Analisando ${selectedMonth}`}
      showMonthSelector
    >
      <Grid>
        <QuickLaunch />
        <BalanceHero projection={projection} />
        <SpendingDonut projection={projection} />
        <SuggestionsCard projection={projection} />
      </Grid>
    </AppShell>
  )
}

export default DashboardPage