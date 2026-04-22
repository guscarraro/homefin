import styled from 'styled-components'
import {
  FiAlertTriangle,
  FiCalendar,
  FiCoffee,
  FiDollarSign,
  FiFlag,
  FiShield,
  FiTarget,
  FiTrendingUp
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
      title: 'Teto da semana',
      text: `Até o fim desta semana, o ideal é não passar de ${formatCurrency(projection.weeklyBudget)}.`,
      icon: 'calendar',
      tone: 'default'
    },
    {
      id: 'day-budget',
      title: 'Teto por dia',
      text: `A régua diária atual está em ${formatCurrency(projection.dailyLimit)}.`,
      icon: 'calendar',
      tone: 'default'
    },
    {
      id: 'market',
      title: 'Mercado',
      text: `Planejado: ${formatCurrency(projection.marketBudget)} • Gasto atual: ${formatCurrency(projection.marketSpent)}.`,
      icon: 'food',
      tone: 'market'
    },
    {
      id: 'food',
      title: 'Alimentação',
      text: `Planejado: ${formatCurrency(projection.foodBudget)} • Gasto atual: ${formatCurrency(projection.foodSpent)}.`,
      icon: 'coffee',
      tone: 'food'
    },
    {
      id: 'leisure',
      title: 'Lazer',
      text: `Planejado: ${formatCurrency(projection.leisureBudget)} • Gasto atual: ${formatCurrency(projection.leisureSpent)}.`,
      icon: 'trend',
      tone: 'leisure'
    },
    {
      id: 'transport',
      title: 'Transporte',
      text: `Planejado: ${formatCurrency(projection.transportBudget)} • Gasto atual: ${formatCurrency(projection.transportSpent)}.`,
      icon: 'calendar',
      tone: 'transport'
    }
  ]

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
      text: `O ideal do mês para objetivos é ${formatCurrency(projection.monthlyGoalsNeed)}.`,
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
    </Card>
  )
}

export default SuggestionsCard