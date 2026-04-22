import AppShell from '../components/layout/AppShell'
import EntriesList from '../components/entries/EntriesList'
import { useFinance } from '../context/FinanceContext'

function EntriesPage() {
  const { visibleEntries, selectedMonth } = useFinance()

  return (
    <AppShell
      title="Lançamentos do mês"
      subtitle={`Analisando ${selectedMonth}`}
      showMonthSelector
    >
      <EntriesList entries={visibleEntries} />
    </AppShell>
  )
}

export default EntriesPage