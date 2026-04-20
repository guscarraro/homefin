import styled from 'styled-components'
import AppShell from '../components/layout/AppShell'
import SalaryMonthForm from '../components/salary/SalaryMonthForm'
import Card from '../components/common/Card'
import { useFinance } from '../context/FinanceContext'

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 16px;
`

function SalariesPage() {
  const { financeData } = useFinance()

  return (
    <AppShell title="Salários">
      <SalaryMonthForm />

      <List>
        {financeData.salaries.map(item => (
          <Card key={item.month}>
            <strong>{item.month}</strong>
            <p>Gustavo: {item.gustavo}</p>
            <p>Marccella: {item.marccella}</p>
          </Card>
        ))}
      </List>
    </AppShell>
  )
}

export default SalariesPage