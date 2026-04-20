import AppShell from '../components/layout/AppShell'
import EntriesList from '../components/entries/EntriesList'
import { useFinance } from '../context/FinanceContext'

function EntriesPage() {
  const { financeData } = useFinance()

  return (
    <AppShell title="Lançamentos">
      <EntriesList entries={financeData.entries} />
    </AppShell>
  )
}

export default EntriesPage