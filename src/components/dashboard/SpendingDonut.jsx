import Card from '../common/Card'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { formatCurrency } from '../../utils/currency'

const COLORS = ['#7c3aed', '#06b6d4', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#14b8a6', '#f97316']

function SpendingDonut({ data }) {
  if (!data.length) {
    return (
      <Card>
        <h3>Custos por categoria</h3>
        <p style={{ marginTop: 10 }}>
          Ainda não existem despesas contabilizadas neste mês para montar o gráfico.
        </p>
      </Card>
    )
  }

  return (
    <Card>
      <h3>Custos do mês por categoria</h3>

      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={72}
              outerRadius={102}
              paddingAngle={3}
            >
              {data.map((entry, index) => (
                <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>

            <Tooltip formatter={value => formatCurrency(value)} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}

export default SpendingDonut