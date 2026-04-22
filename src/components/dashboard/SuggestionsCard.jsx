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

function SuggestionsCard({ projection }) {
  if (!projection?.hasSalary) {
    return (
      <Card>
        <h3>Sugestões e alertas</h3>
        <p>Nenhuma sugestão disponível.</p>
      </Card>
    )
  }

  const weekItems = [
    {
      id: 'week-budget',
      title: 'Quanto ainda pode gastar nesta semana',
      text: `Faltam ${projection.daysLeftInWeek} dia(s) para fechar a semana. O ideal é não passar de ${formatCurrency(projection.weeklyBudget)} nesse período.`,
      icon: 'calendar',
      tone: 'default'
    },
    {
      id: 'day-budget',
      title: 'Quanto isso representa por dia até o fim do mês',
      text: `Faltam ${projection.daysLeftInMonth} dia(s) para acabar o mês. Sua régua diária geral está em ${formatCurrency(projection.dailyLimit)} por dia.`,
      icon: 'calendar',
      tone: 'default'
    }
  ]

  const weeklyCategoryItems = []

  for (const item of projection.categoryPlans || []) {
    const weeklyAllowed = getWeeklyAllowedAmount(item, projection)
    const dailyAllowed = getDailyAllowedAmount(item, projection)
    const isOverBudget = item.spent > item.planned && item.planned > 0
    const tone = isOverBudget ? 'danger' : item.tone || 'default'

    weeklyCategoryItems.push({
      id: `week-category-${item.name}`,
      title: `${item.name} nesta semana`,
      text: isOverBudget
        ? `Essa categoria já passou do planejado do mês. O ideal agora é travar novos gastos nela até o próximo fechamento.`
        : `Até o fim desta semana, ainda dá para usar ${formatCurrency(weeklyAllowed)} nessa categoria. Isso representa cerca de ${formatCurrency(dailyAllowed)} por dia.`,
      icon: getToneIcon(item.tone),
      tone
    })
  }

  const monthItems = [
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

  const categoryItems = []

  for (const item of projection.categoryPlans || []) {
    const isOverBudget = item.spent > item.planned && item.planned > 0
    const tone = isOverBudget ? 'danger' : item.tone || 'default'

    categoryItems.push({
      id: `category-${item.name}`,
      title: item.name,
      text: `Previsto: ${item.percent}% do salário • Planejado: ${formatCurrency(item.planned)} • Gasto atual: ${formatCurrency(item.spent)} • Ainda pode gastar no mês: ${formatCurrency(item.remaining)}.`,
      icon: getToneIcon(item.tone),
      tone
    })
  }

  return (
    <Card>
      <h3>Sugestões e alertas</h3>

      <Section>
        <SectionTitle>Visão da semana</SectionTitle>

        <List>
          {weekItems.map(item => {
            const colors = getToneColors(item.tone)

            return (
              <Item
                key={item.id}
                color={colors.color}
                background={colors.background}
              >
                <IconBox
                  iconBackground={colors.iconBackground}
                  iconColor={colors.iconColor}
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

      <Section>
        <SectionTitle>Quanto ainda pode gastar por categoria nesta semana</SectionTitle>

        <List>
          {weeklyCategoryItems.map(item => {
            const colors = getToneColors(item.tone)

            return (
              <Item
                key={item.id}
                color={colors.color}
                background={colors.background}
              >
                <IconBox
                  iconBackground={colors.iconBackground}
                  iconColor={colors.iconColor}
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

      <Section>
        <SectionTitle>Visão do mês</SectionTitle>

        <List>
          {monthItems.map(item => {
            const colors = getToneColors(item.tone)

            return (
              <Item
                key={item.id}
                color={colors.color}
                background={colors.background}
              >
                <IconBox
                  iconBackground={colors.iconBackground}
                  iconColor={colors.iconColor}
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

      <Section>
        <SectionTitle>Categorias do mês</SectionTitle>

        <List>
          {categoryItems.map(item => {
            const colors = getToneColors(item.tone)

            return (
              <Item
                key={item.id}
                color={colors.color}
                background={colors.background}
              >
                <IconBox
                  iconBackground={colors.iconBackground}
                  iconColor={colors.iconColor}
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
    </Card>
  )
}

export default SuggestionsCard