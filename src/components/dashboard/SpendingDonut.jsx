import { useMemo, useState } from 'react'
import styled from 'styled-components'
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Sector
} from 'recharts'
import Card from '../common/Card'
import { formatCurrency } from '../../utils/currency'

const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 18px;
`

const Subtitle = styled.p`
  color: ${({ theme }) => theme.colors.textSoft};
  line-height: 1.45;
`

const ChartArea = styled.div`
  position: relative;
  width: 100%;
  height: 340px;
`

const ChartWrap = styled.div`
  position: relative;
  z-index: 2;
  width: 100%;
  height: 100%;
`

const CenterInfo = styled.div`
  position: absolute;
  inset: 0;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
`

const CenterInner = styled.div`
  width: 124px;
  height: 124px;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.surface};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  text-align: center;
  box-shadow: inset 0 0 0 1px ${({ theme }) => theme.colors.border};
`

const CenterLabel = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textSoft};
  max-width: 90px;
  line-height: 1.2;
`

const CenterValue = styled.div`
  font-size: 20px;
  font-weight: 800;
  line-height: 1;
`

const CenterSubValue = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textSoft};
  max-width: 96px;
  line-height: 1.25;
`

const LegendsGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 10px;
  margin-top: 18px;
`

const LegendCard = styled.div`
  min-width: 0;
  border-radius: 18px;
  padding: 12px;
  background: ${({ theme }) => theme.colors.surfaceAlt};
`

const LegendTitle = styled.div`
  font-size: 14px;
  font-weight: 800;
  margin-bottom: 10px;
`

const LegendList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`

const LegendItem = styled.button`
  width: 100%;
  border: 0;
  text-align: left;
  cursor: pointer;
  border-radius: 14px;
  padding: 10px 10px 9px;
  background: ${({ active, theme }) =>
    active ? theme.colors.primarySoft : 'rgba(255,255,255,0.02)'};
  box-shadow: ${({ active }) =>
    active ? 'inset 0 0 0 1px rgba(255,255,255,0.85)' : 'none'};
  transition: 0.2s ease;
`

const LegendTop = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px;
`

const LegendLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  flex: 1;
`

const ColorDot = styled.span`
  width: 12px;
  height: 12px;
  border-radius: 999px;
  flex-shrink: 0;
  background: ${({ color }) => color};
`

const LegendName = styled.span`
  font-size: 13px;
  font-weight: 700;
  line-height: 1.2;
  word-break: break-word;
`

const LegendValueRow = styled.div`
  margin-top: 6px;
  padding-left: 20px;
`

const LegendValue = styled.div`
  font-size: 13px;
  font-weight: 800;
  line-height: 1.2;
  word-break: break-word;
`

const LegendMeta = styled.div`
  margin-top: 4px;
  padding-left: 20px;
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textSoft};
  line-height: 1.35;
`

const Footer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-top: 18px;
`

const Stat = styled.div`
  padding: 12px;
  border-radius: 16px;
  background: ${({ theme }) => theme.colors.surfaceAlt};
`

const StatLabel = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textSoft};
  margin-bottom: 4px;
`

const StatValue = styled.div`
  font-size: 18px;
  font-weight: 700;
`

const COLORS = {
  investment: {
    planned: '#6d28d9',
    actual: '#a78bfa'
  },
  goals: {
    planned: '#0f766e',
    actual: '#5eead4'
  },
  fixed: {
    planned: '#1d4ed8',
    actual: '#60a5fa'
  },
  market: {
    planned: '#15803d',
    actual: '#4ade80'
  },
  food: {
    planned: '#c2410c',
    actual: '#fb923c'
  },
  leisure: {
    planned: '#be123c',
    actual: '#fb7185'
  },
  transport: {
    planned: '#a16207',
    actual: '#facc15'
  },
  other: {
    planned: '#374151',
    actual: '#9ca3af'
  }
}

function getCategoryVisual(name) {
  const normalized = String(name || '').toLowerCase()

  if (normalized.includes('invest')) {
    return {
      key: 'investment',
      planned: COLORS.investment.planned,
      actual: COLORS.investment.actual
    }
  }

  if (normalized.includes('meta')) {
    return {
      key: 'goals',
      planned: COLORS.goals.planned,
      actual: COLORS.goals.actual
    }
  }

  if (normalized.includes('fix')) {
    return {
      key: 'fixed',
      planned: COLORS.fixed.planned,
      actual: COLORS.fixed.actual
    }
  }

  if (normalized.includes('mercado')) {
    return {
      key: 'market',
      planned: COLORS.market.planned,
      actual: COLORS.market.actual
    }
  }

  if (normalized.includes('alimenta')) {
    return {
      key: 'food',
      planned: COLORS.food.planned,
      actual: COLORS.food.actual
    }
  }

  if (normalized.includes('lazer')) {
    return {
      key: 'leisure',
      planned: COLORS.leisure.planned,
      actual: COLORS.leisure.actual
    }
  }

  if (normalized.includes('transporte')) {
    return {
      key: 'transport',
      planned: COLORS.transport.planned,
      actual: COLORS.transport.actual
    }
  }

  return {
    key: 'other',
    planned: COLORS.other.planned,
    actual: COLORS.other.actual
  }
}

function getTotal(data) {
  let total = 0

  for (const item of data || []) {
    total += Number(item.value || 0)
  }

  return Number(total.toFixed(2))
}

function getPercent(value, total) {
  if (!total) {
    return 0
  }

  return Number(((Number(value || 0) / total) * 100).toFixed(1))
}

function buildComparableData(projection) {
  const plannedBase = [
    {
      name: 'Investimento',
      helper: 'Meta ideal',
      value: Number((projection.aggressiveInvestment || projection.investmentSuggested || 0).toFixed(2))
    },
    {
      name: 'Metas',
      helper: 'Reserva mensal',
      value: Number(projection.monthlyGoalsNeed.toFixed(2))
    },
    {
      name: 'Custos fixos',
      helper: 'Compromisso fixo',
      value: Number(projection.fixedCosts.toFixed(2))
    },
    {
      name: 'Mercado',
      helper: 'Teto saudável',
      value: Number(projection.marketBudget.toFixed(2))
    },
    {
      name: 'Alimentação',
      helper: 'Teto saudável',
      value: Number(projection.foodBudget.toFixed(2))
    },
    {
      name: 'Lazer',
      helper: 'Teto saudável',
      value: Number(projection.leisureBudget.toFixed(2))
    },
    {
      name: 'Transporte',
      helper: 'Teto saudável',
      value: Number(projection.transportBudget.toFixed(2))
    },
    {
      name: 'Outros',
      helper: 'Margem prevista',
      value: Number(projection.otherBudget.toFixed(2))
    }
  ]

  const actualBase = [
    {
      name: 'Investimento',
      helper: 'Realizado',
      value: Number(projection.investments.toFixed(2))
    },
    {
      name: 'Metas',
      helper: 'Separado no mês',
      value: Number(projection.monthlyGoalsNeed.toFixed(2))
    },
    {
      name: 'Custos fixos',
      helper: 'Realizado',
      value: Number(projection.fixedCosts.toFixed(2))
    },
    {
      name: 'Mercado',
      helper: 'Gasto atual',
      value: Number(projection.marketSpent.toFixed(2))
    },
    {
      name: 'Alimentação',
      helper: 'Gasto atual',
      value: Number(projection.foodSpent.toFixed(2))
    },
    {
      name: 'Lazer',
      helper: 'Gasto atual',
      value: Number(projection.leisureSpent.toFixed(2))
    },
    {
      name: 'Transporte',
      helper: 'Gasto atual',
      value: Number(projection.transportSpent.toFixed(2))
    },
    {
      name: 'Outros',
      helper: 'Gasto atual',
      value: Number(projection.otherSpent.toFixed(2))
    }
  ]

  const planned = []
  const actual = []

  for (const item of plannedBase) {
    if (item.value <= 0) {
      continue
    }

    const visual = getCategoryVisual(item.name)

    planned.push({
      ...item,
      fill: visual.planned,
      compareKey: visual.key
    })
  }

  for (const item of actualBase) {
    if (item.value < 0) {
      continue
    }

    const visual = getCategoryVisual(item.name)

    actual.push({
      ...item,
      fill: visual.actual,
      compareKey: visual.key
    })
  }

  return {
    planned,
    actual
  }
}

function buildLegendRows(planned, actual, salary) {
  const rows = []
  const actualMap = {}

  for (const item of actual) {
    actualMap[item.compareKey] = item
  }

  for (const item of planned) {
    const currentActual = actualMap[item.compareKey]
    const actualValue = currentActual ? currentActual.value : 0
    const salaryPercentPlanned = getPercent(item.value, salary)
    const salaryPercentActual = getPercent(actualValue, salary)
    const categoryProgress = item.value > 0 ? Number(((actualValue / item.value) * 100).toFixed(1)) : 0

    rows.push({
      compareKey: item.compareKey,
      name: item.name,
      plannedColor: item.fill,
      actualColor: currentActual ? currentActual.fill : item.fill,
      plannedValue: item.value,
      actualValue,
      plannedHelper: item.helper,
      actualHelper: currentActual ? currentActual.helper : 'Sem gasto',
      salaryPercentPlanned,
      salaryPercentActual,
      categoryProgress
    })
  }

  return rows
}

function findIndexByCompareKey(data, compareKey) {
  if (!compareKey) {
    return -1
  }

  for (let index = 0; index < data.length; index += 1) {
    if (data[index].compareKey === compareKey) {
      return index
    }
  }

  return -1
}

function renderActiveShape(props) {
  const {
    cx,
    cy,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill
  } = props

  return (
    <Sector
      cx={cx}
      cy={cy}
      innerRadius={innerRadius}
      outerRadius={outerRadius + 8}
      startAngle={startAngle}
      endAngle={endAngle}
      fill={fill}
      stroke="none"
    />
  )
}

function CustomTooltip({ active, payload }) {
  if (!active || !payload || !payload.length) {
    return null
  }

  const current = payload[0]?.payload

  if (!current) {
    return null
  }

  return (
    <div
      style={{
        position: 'relative',
        zIndex: 20,
        background: '#111827',
        color: '#fff',
        padding: '10px 12px',
        borderRadius: '12px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.25)'
      }}
    >
      <div style={{ fontWeight: 700, marginBottom: 4 }}>{current.name}</div>
      <div style={{ fontSize: 13 }}>
        {current.helper}: {formatCurrency(current.value)}
      </div>
    </div>
  )
}

function SpendingDonut({ projection }) {
  const [selectedKey, setSelectedKey] = useState(null)

  const comparableData = useMemo(() => buildComparableData(projection), [projection])
  const planned = comparableData.planned
  const actual = comparableData.actual

  const plannedTotal = getTotal(planned)
  const actualTotal = getTotal(actual)

  const legendRows = useMemo(
    () => buildLegendRows(planned, actual, projection.salary),
    [planned, actual, projection.salary]
  )

  const selectedRow = useMemo(() => {
    if (!selectedKey) {
      return null
    }

    for (const row of legendRows) {
      if (row.compareKey === selectedKey) {
        return row
      }
    }

    return null
  }, [legendRows, selectedKey])

  const plannedActiveIndex = findIndexByCompareKey(planned, selectedKey)
  const actualActiveIndex = findIndexByCompareKey(actual, selectedKey)

  const centerTitle = selectedRow ? selectedRow.name : 'Comparativo'
  const centerValue = selectedRow
    ? `${selectedRow.categoryProgress}%`
    : `${getPercent(actualTotal, projection.salary)}%`
  const centerSubValue = selectedRow
    ? `${formatCurrency(selectedRow.actualValue)} de ${formatCurrency(selectedRow.plannedValue)}`
    : `${formatCurrency(actualTotal)} do mês`

  function handleSelect(compareKey) {
    setSelectedKey(current => {
      if (current === compareKey) {
        return null
      }

      return compareKey
    })
  }

  function getSliceOpacity(compareKey) {
    if (!selectedKey) {
      return 1
    }

    return selectedKey === compareKey ? 1 : 0.24
  }

  function handlePieClick(data) {
    if (!data || !data.compareKey) {
      return
    }

    handleSelect(data.compareKey)
  }

  if (!projection.hasSalary) {
    return (
      <Card>
        <h3>Planejado x real</h3>
        <p style={{ marginTop: 10 }}>
          Sem salário informado ainda, então o comparativo inteligente do mês não pode ser calculado.
        </p>
      </Card>
    )
  }

  return (
    <Card>
      <Header>
        <h3>Planejado x real do mês</h3>
        <Subtitle>
          O anel interno mostra o planejado e o externo mostra o que realmente aconteceu. Toque em uma fatia ou em uma linha da lista para comparar os dois lados.
        </Subtitle>
      </Header>

      <ChartArea>
        <ChartWrap>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={planned}
                dataKey="value"
                nameKey="name"
                innerRadius={42}
                outerRadius={78}
                paddingAngle={2}
                stroke="none"
                activeIndex={plannedActiveIndex >= 0 ? plannedActiveIndex : undefined}
                activeShape={renderActiveShape}
                onClick={handlePieClick}
              >
                {planned.map(entry => (
                  <Cell
                    key={`planned-${entry.compareKey}`}
                    fill={entry.fill}
                    fillOpacity={getSliceOpacity(entry.compareKey)}
                    style={{ cursor: 'pointer' }}
                  />
                ))}
              </Pie>

              <Pie
                data={actual}
                dataKey="value"
                nameKey="name"
                innerRadius={92}
                outerRadius={122}
                paddingAngle={2}
                stroke="none"
                activeIndex={actualActiveIndex >= 0 ? actualActiveIndex : undefined}
                activeShape={renderActiveShape}
                onClick={handlePieClick}
              >
                {actual.map(entry => (
                  <Cell
                    key={`actual-${entry.compareKey}`}
                    fill={entry.fill}
                    fillOpacity={getSliceOpacity(entry.compareKey)}
                    style={{ cursor: 'pointer' }}
                  />
                ))}
              </Pie>

              <Tooltip
                content={<CustomTooltip />}
                wrapperStyle={{ zIndex: 20 }}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartWrap>

        <CenterInfo>
          <CenterInner>
            <CenterLabel>{centerTitle}</CenterLabel>
            <CenterValue>{centerValue}</CenterValue>
            <CenterSubValue>{centerSubValue}</CenterSubValue>
          </CenterInner>
        </CenterInfo>
      </ChartArea>

      <LegendsGrid>
        <LegendCard>
          <LegendTitle>Planejado</LegendTitle>

          <LegendList>
            {legendRows.map(item => (
              <LegendItem
                key={`legend-planned-${item.compareKey}`}
                type="button"
                active={selectedKey === item.compareKey ? 1 : 0}
                onClick={() => handleSelect(item.compareKey)}
              >
                <LegendTop>
                  <LegendLeft>
                    <ColorDot color={item.plannedColor} />
                    <LegendName>{item.name}</LegendName>
                  </LegendLeft>
                </LegendTop>

                <LegendValueRow>
                  <LegendValue>{formatCurrency(item.plannedValue)}</LegendValue>
                </LegendValueRow>

                <LegendMeta>
                  {item.plannedHelper} • {item.salaryPercentPlanned}% do salário
                </LegendMeta>
              </LegendItem>
            ))}
          </LegendList>
        </LegendCard>

        <LegendCard>
          <LegendTitle>O que de fato ocorreu</LegendTitle>

          <LegendList>
            {legendRows.map(item => (
              <LegendItem
                key={`legend-actual-${item.compareKey}`}
                type="button"
                active={selectedKey === item.compareKey ? 1 : 0}
                onClick={() => handleSelect(item.compareKey)}
              >
                <LegendTop>
                  <LegendLeft>
                    <ColorDot color={item.actualColor} />
                    <LegendName>{item.name}</LegendName>
                  </LegendLeft>
                </LegendTop>

                <LegendValueRow>
                  <LegendValue>{formatCurrency(item.actualValue)}</LegendValue>
                </LegendValueRow>

                <LegendMeta>
                  {item.actualHelper} • {item.salaryPercentActual}% do salário • {item.categoryProgress}% do planejado
                </LegendMeta>
              </LegendItem>
            ))}
          </LegendList>
        </LegendCard>
      </LegendsGrid>

      <Footer>
        <Stat>
          <StatLabel>Planejado total</StatLabel>
          <StatValue>{formatCurrency(plannedTotal)}</StatValue>
        </Stat>

        <Stat>
          <StatLabel>Realizado total</StatLabel>
          <StatValue>{formatCurrency(actualTotal)}</StatValue>
        </Stat>

        <Stat>
          <StatLabel>Sobra antes das metas</StatLabel>
          <StatValue>{formatCurrency(projection.availableToSpend)}</StatValue>
        </Stat>

        <Stat>
          <StatLabel>Sobra real após metas</StatLabel>
          <StatValue>{formatCurrency(projection.availableAfterGoals)}</StatValue>
        </Stat>
      </Footer>
    </Card>
  )
}

export default SpendingDonut