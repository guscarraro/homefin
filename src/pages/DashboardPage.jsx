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
  const { projection, categoryTotals, suggestions } = useFinance()

  return (
    <AppShell title="Resumo do mês">
      <Grid>
        <BalanceHero projection={projection} />
        <SpendingDonut projection={projection} />
        <QuickLaunch />
        <SuggestionsCard suggestions={suggestions} />
      </Grid>
    </AppShell>
  )
}

export default DashboardPage