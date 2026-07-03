import { useMemo, useState } from 'react'
import styled from 'styled-components'
import {
  FiAlertTriangle,
  FiCalendar,
  FiCoffee,
  FiDollarSign,
  FiFlag,
  FiHeart,
  FiHome,
  FiPackage,
  FiRepeat,
  FiShield,
  FiShoppingBag,
  FiTarget,
  FiTrendingUp,
  FiTruck
} from 'react-icons/fi'
import Card from '../common/Card'
import { formatCurrency } from '../../utils/currency'

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;

  & + & {
    margin-top: 20px;
  }
`

const SectionTitle = styled.h4`
  font-size: 16px;
`

const Header = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;

  h3 {
    margin-bottom: 4px;
  }

  p {
    color: ${({ theme }) => theme.colors.textSoft};
    line-height: 1.4;
  }

  @media (max-width: 520px) {
    flex-direction: column;
  }
`

const SelectWrap = styled.label`
  min-width: 150px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  color: ${({ theme }) => theme.colors.textSoft};
  font-size: 12px;
`

const PeriodSelect = styled.select`
  width: 100%;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surfaceAlt};
  color: ${({ theme }) => theme.colors.text};
  padding: 10px 12px;
  font-weight: 700;
  outline: none;

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primarySoft};
  }
`

const FocusPanel = styled.div`
  display: grid;
  grid-template-columns: 44px 1fr;
  gap: 12px;
  padding: 14px;
  border-radius: 8px;
  border: 1px solid ${({ toneColor }) => toneColor};
  background: ${({ toneBackground }) => toneBackground};
  margin-bottom: 14px;
`

const MetricGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
  margin-top: 12px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`

const Metric = styled.div`
  min-width: 0;
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  padding: 10px;
`

const MetricLabel = styled.div`
  color: ${({ theme }) => theme.colors.textSoft};
  font-size: 12px;
  margin-bottom: 4px;
`

const MetricValue = styled.div`
  font-size: 16px;
  font-weight: 800;
`

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const Item = styled.div`
  display: grid;
  grid-template-columns: 44px 1fr;
  gap: 12px;
  align-items: start;
  padding: 14px;
  border-radius: 18px;
  border: 1px solid ${({ color }) => color};
  background: ${({ background }) => background};
`

const IconBox = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ iconBackground }) => iconBackground};
  color: ${({ iconColor }) => iconColor};
`

const Title = styled.div`
  font-weight: 700;
  margin-bottom: 4px;
`

const Text = styled.p`
  color: ${({ theme }) => theme.colors.text};
  opacity: 0.88;
  line-height: 1.45;
`

function getSuggestionIcon(icon) {
  if (icon === 'wallet') return <FiDollarSign size={20} />
  if (icon === 'food') return <FiCoffee size={20} />
  if (icon === 'coffee') return <FiCoffee size={20} />
  if (icon === 'target') return <FiTarget size={20} />
  if (icon === 'trend') return <FiTrendingUp size={20} />
  if (icon === 'calendar') return <FiCalendar size={20} />
  if (icon === 'goal') return <FiFlag size={20} />
  if (icon === 'shield') return <FiShield size={20} />
  if (icon === 'danger') return <FiAlertTriangle size={20} />
  if (icon === 'health') return <FiHeart size={20} />
  if (icon === 'home') return <FiHome size={20} />
  if (icon === 'subscription') return <FiRepeat size={20} />
  if (icon === 'pets') return <FiPackage size={20} />
  if (icon === 'shopping') return <FiShoppingBag size={20} />
  if (icon === 'transport') return <FiTruck size={20} />
  return <FiTarget size={20} />
}

function getToneColors(tone) {
  if (tone === 'market') {
    return {
      color: '#15803d',
      background: 'rgba(34, 197, 94, 0.10)',
      iconBackground: 'rgba(34, 197, 94, 0.18)',
      iconColor: '#22c55e'
    }
  }

  if (tone === 'food') {
    return {
      color: '#c2410c',
      background: 'rgba(249, 115, 22, 0.10)',
      iconBackground: 'rgba(249, 115, 22, 0.18)',
      iconColor: '#fb923c'
    }
  }

  if (tone === 'leisure') {
    return {
      color: '#be123c',
      background: 'rgba(244, 63, 94, 0.10)',
      iconBackground: 'rgba(244, 63, 94, 0.18)',
      iconColor: '#fb7185'
    }
  }

  if (tone === 'transport') {
    return {
      color: '#a16207',
      background: 'rgba(250, 204, 21, 0.10)',
      iconBackground: 'rgba(250, 204, 21, 0.18)',
      iconColor: '#facc15'
    }
  }

  if (tone === 'investment') {
    return {
      color: '#6d28d9',
      background: 'rgba(124, 58, 237, 0.10)',
      iconBackground: 'rgba(124, 58, 237, 0.18)',
      iconColor: '#a78bfa'
    }
  }

  if (tone === 'goal') {
    return {
      color: '#0f766e',
      background: 'rgba(45, 212, 191, 0.10)',
      iconBackground: 'rgba(45, 212, 191, 0.18)',
      iconColor: '#5eead4'
    }
  }

  if (tone === 'health') {
    return {
      color: '#0891b2',
      background: 'rgba(34, 211, 238, 0.10)',
      iconBackground: 'rgba(34, 211, 238, 0.18)',
      iconColor: '#67e8f9'
    }
  }

  if (tone === 'house') {
    return {
      color: '#2563eb',
      background: 'rgba(59, 130, 246, 0.10)',
      iconBackground: 'rgba(59, 130, 246, 0.18)',
      iconColor: '#93c5fd'
    }
  }

  if (tone === 'subscription') {
    return {
      color: '#7c3aed',
      background: 'rgba(167, 139, 250, 0.10)',
      iconBackground: 'rgba(167, 139, 250, 0.18)',
      iconColor: '#c4b5fd'
    }
  }

  if (tone === 'pets') {
    return {
      color: '#9333ea',
      background: 'rgba(192, 132, 252, 0.10)',
      iconBackground: 'rgba(192, 132, 252, 0.18)',
      iconColor: '#d8b4fe'
    }
  }

  if (tone === 'shopping') {
    return {
      color: '#ea580c',
      background: 'rgba(251, 146, 60, 0.10)',
      iconBackground: 'rgba(251, 146, 60, 0.18)',
      iconColor: '#fdba74'
    }
  }

  if (tone === 'danger') {
    return {
      color: '#ef4444',
      background: 'rgba(248, 113, 113, 0.10)',
      iconBackground: 'rgba(248, 113, 113, 0.18)',
      iconColor: '#f87171'
    }
  }

  return {
    color: '#64748b',
    background: 'rgba(148, 163, 184, 0.10)',
    iconBackground: 'rgba(148, 163, 184, 0.18)',
    iconColor: '#cbd5e1'
  }
}

function getToneIcon(tone) {
  if (tone === 'market') return 'food'
  if (tone === 'food') return 'coffee'
  if (tone === 'leisure') return 'trend'
  if (tone === 'transport') return 'transport'
  if (tone === 'investment') return 'shield'
  if (tone === 'goal') return 'goal'
  if (tone === 'health') return 'health'
  if (tone === 'house') return 'home'
  if (tone === 'subscription') return 'subscription'
  if (tone === 'pets') return 'pets'
  if (tone === 'shopping') return 'shopping'
  if (tone === 'danger') return 'danger'
  return 'calendar'
}

function getWeeklyAllowedAmount(categoryPlan, projection) {
  const daysLeftInMonth = Math.max(1, Number(projection.daysLeftInMonth || 1))
  const daysLeftInWeek = Math.max(1, Number(projection.daysLeftInWeek || 1))
  const remaining = Math.max(0, Number(categoryPlan.remaining || 0))

  return Number(((remaining / daysLeftInMonth) * daysLeftInWeek).toFixed(2))
}

function getDailyAllowedAmount(categoryPlan, projection) {
  const daysLeftInWeek = Math.max(1, Number(projection.daysLeftInWeek || 1))
  const weeklyAllowed = getWeeklyAllowedAmount(categoryPlan, projection)

  return Number((weeklyAllowed / daysLeftInWeek).toFixed(2))
}

function getExceededAmount(item) {
  return Math.max(0, Number((item.spent - item.planned).toFixed(2)))
}

function getExceededPercent(item) {
  if (item.planned <= 0) {
    return item.spent > 0 ? 100 : 0
  }

  return Number((((item.spent - item.planned) / item.planned) * 100).toFixed(1))
}

function getRemainingDays(projection, period) {
  if (period === 'daily') return 1
  if (period === 'weekly') return Math.max(1, Number(projection.daysLeftInWeek || 1))
  return Math.max(1, Number(projection.daysLeftInMonth || 1))
}

function getPeriodLabel(period) {
  if (period === 'daily') return 'Hoje'
  if (period === 'weekly') return 'Esta semana'
  return 'Até o fim do mês'
}

function getPeriodCopy(period, projection) {
  if (period === 'daily') {
    return {
      title: 'Régua diária',
      text: `Para manter o mês sob controle, o limite de hoje fica em ${formatCurrency(projection.dailyLimit)}.`,
      action: projection.dailyLimit > 0
        ? 'Use esse valor como trava do dia. Se uma compra passar disso, jogue para outro dia ou corte uma categoria menos importante.'
        : 'Hoje não há folga real. Evite novos gastos variáveis e registre apenas compromissos que não podem ser adiados.'
    }
  }

  if (period === 'weekly') {
    return {
      title: 'Ritmo da semana',
      text: `Faltam ${projection.daysLeftInWeek} dia(s) para fechar a semana. O teto recomendado é ${formatCurrency(projection.weeklyBudget)}.`,
      action: projection.weeklyBudget > 0
        ? 'Divida esse teto entre compras essenciais e deixe gastos de lazer para depois que as despesas fixas da semana estiverem pagas.'
        : 'A semana já está apertada. Priorize mercado, transporte e contas obrigatórias; qualquer extra deve esperar.'
    }
  }

  return {
    title: 'Plano até o fim do mês',
    text: `Faltam ${projection.daysLeftInMonth} dia(s). Depois dos compromissos, o saldo projetado é ${formatCurrency(projection.availableAfterGoals)}.`,
    action: projection.availableAfterGoals >= 0
      ? 'Mantenha os gastos variáveis dentro da média diária e separe primeiro investimento e metas para não consumir a sobra.'
      : 'O mês fecha negativo nesse ritmo. Corte gastos sem teto, pause categorias estouradas e revise o que pode ser empurrado para o próximo mês.'
  }
}

function getPeriodAmount(item, projection, period) {
  if (period === 'daily') return getDailyAllowedAmount(item, projection)
  if (period === 'weekly') return getWeeklyAllowedAmount(item, projection)
  return Math.max(0, Number(item.remaining || 0))
}

function buildPeriodCategoryItems(projection, period) {
  return (projection.categoryPlans || []).map(item => {
    const exceededAmount = getExceededAmount(item)
    const exceededPercent = getExceededPercent(item)
    const isOverBudget = item.spent > item.planned && item.planned > 0
    const isSpentWithoutBudget = item.spent > 0 && item.planned <= 0
    const tone = isOverBudget || isSpentWithoutBudget ? 'danger' : item.tone || 'default'
    const allowedAmount = getPeriodAmount(item, projection, period)
    const remainingDays = getRemainingDays(projection, period)

    return {
      id: `${period}-category-${item.name}`,
      title: item.name,
      text: isOverBudget
        ? `Teto mensal estourado em ${formatCurrency(exceededAmount)} (${exceededPercent}% acima). ${getPeriodLabel(period)} deve ficar sem novos gastos nessa categoria.`
        : isSpentWithoutBudget
          ? `Sem teto previsto, mas já consumiu ${formatCurrency(item.spent)}. Trate como gasto fora da curva e evite repetir.`
          : `${getPeriodLabel(period)}: use até ${formatCurrency(allowedAmount)}. Isso equivale a ${formatCurrency(allowedAmount / remainingDays)} por dia dentro desse período.`,
      meta: `Gasto: ${formatCurrency(item.spent)} de ${formatCurrency(item.planned)} no mês`,
      icon: getToneIcon(item.tone),
      tone,
      priority: isOverBudget ? 0 : isSpentWithoutBudget ? 1 : item.remaining <= 0 ? 2 : 3
    }
  }).sort((first, second) => first.priority - second.priority)
}

function SuggestionsCard({ projection }) {
  const [period, setPeriod] = useState('weekly')
  const periodCopy = useMemo(() => getPeriodCopy(period, projection || {}), [period, projection])
  const categoryItems = useMemo(
    () => buildPeriodCategoryItems(projection || {}, period),
    [period, projection]
  )

  if (!projection?.hasSalary) {
    return (
      <Card>
        <h3>Sugestões e alertas</h3>
        <p>Nenhuma sugestão disponível.</p>
      </Card>
    )
  }

  const colors = getToneColors(projection.availableAfterGoals < 0 ? 'danger' : 'goal')
  const contextItems = [
    {
      id: 'investment',
      title: 'Investimento mínimo',
      text: `Meta mínima do mês: ${formatCurrency(projection.investmentSuggested)} • Aporte atual: ${formatCurrency(projection.investments)}.`,
      icon: 'shield',
      tone: 'investment'
    },
    {
      id: 'goals',
      title: 'Reserva mensal das metas',
      text: `O ideal do mês para objetivos é ${formatCurrency(projection.monthlyGoalsNeed)} e o que já foi pago de verdade nelas foi ${formatCurrency(projection.goalPayments)}.`,
      icon: 'goal',
      tone: 'goal'
    },
    {
      id: 'month-left',
      title: 'Saldo até o fim do mês',
      text: `Depois dos compromissos, ainda sobram ${formatCurrency(projection.availableAfterGoals)}.`,
      icon: 'wallet',
      tone: projection.availableAfterGoals >= 0 ? 'default' : 'danger'
    },
    {
      id: 'next-month',
      title: 'Próximo mês',
      text: `O mês seguinte já começa com ${formatCurrency(projection.nextMonthCommitted)} comprometidos.`,
      icon: 'target',
      tone: projection.nextMonthCommitted > 0 ? 'danger' : 'default'
    }
  ]

  return (
    <Card>
      <Header>
        <div>
          <h3>Sugestões e alertas</h3>
          <p>Escolha o horizonte e veja o limite recomendado com a ação mais importante.</p>
        </div>

        <SelectWrap>
          Período
          <PeriodSelect value={period} onChange={event => setPeriod(event.target.value)}>
            <option value="daily">Diária</option>
            <option value="weekly">Semanal</option>
            <option value="monthly">Mensal</option>
          </PeriodSelect>
        </SelectWrap>
      </Header>

      <FocusPanel
        toneColor={colors.color}
        toneBackground={colors.background}
      >
        <IconBox
          iconBackground={colors.iconBackground}
          iconColor={colors.iconColor}
        >
          {getSuggestionIcon(period === 'monthly' ? 'target' : 'calendar')}
        </IconBox>

        <div>
          <Title>{periodCopy.title}</Title>
          <Text>{periodCopy.text}</Text>
          <Text>{periodCopy.action}</Text>

          <MetricGrid>
            <Metric>
              <MetricLabel>Hoje</MetricLabel>
              <MetricValue>{formatCurrency(projection.dailyLimit)}</MetricValue>
            </Metric>
            <Metric>
              <MetricLabel>Semana</MetricLabel>
              <MetricValue>{formatCurrency(projection.weeklyBudget)}</MetricValue>
            </Metric>
            <Metric>
              <MetricLabel>Fim do mês</MetricLabel>
              <MetricValue>{formatCurrency(projection.availableAfterGoals)}</MetricValue>
            </Metric>
          </MetricGrid>
        </div>
      </FocusPanel>

      <Section>
        <SectionTitle>Limite por categoria</SectionTitle>

        <List>
          {categoryItems.map(item => {
            const itemColors = getToneColors(item.tone)

            return (
              <Item
                key={item.id}
                color={itemColors.color}
                background={itemColors.background}
              >
                <IconBox
                  iconBackground={itemColors.iconBackground}
                  iconColor={itemColors.iconColor}
                >
                  {getSuggestionIcon(item.icon)}
                </IconBox>

                <div>
                  <Title>{item.title}</Title>
                  <Text>{item.text}</Text>
                  <Text>{item.meta}</Text>
                </div>
              </Item>
            )
          })}
        </List>
      </Section>

      {period === 'monthly' && (
        <Section>
          <SectionTitle>Compromissos do mês</SectionTitle>

          <List>
            {contextItems.map(item => {
              const itemColors = getToneColors(item.tone)

              return (
                <Item
                  key={item.id}
                  color={itemColors.color}
                  background={itemColors.background}
                >
                  <IconBox
                    iconBackground={itemColors.iconBackground}
                    iconColor={itemColors.iconColor}
                  >
                    {getSuggestionIcon(item.icon)}
                  </IconBox>

                  <div>
                    <Title>{item.title}</Title>
                    <Text>{item.text}</Text>
                  </div>
                </Item>
              )
            })}
          </List>
        </Section>
      )}
    </Card>
  )
}

export default SuggestionsCard
