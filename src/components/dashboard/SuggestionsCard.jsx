import styled from 'styled-components'
import {
  FiAlertTriangle,
  FiCalendar,
  FiFlag,
  FiShield,
  FiTarget,
  FiTrendingUp,
  FiUtensils,
  FiWallet
} from 'react-icons/fi'
import Card from '../common/Card'

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
  border: 1px solid ${({ tone, theme }) => {
    if (tone === 'success') return theme.colors.success
    if (tone === 'danger') return theme.colors.danger
    if (tone === 'warning') return theme.colors.warning
    return theme.colors.border
  }};
  background: ${({ tone, theme }) => {
    if (tone === 'success') return 'rgba(34, 197, 94, 0.10)'
    if (tone === 'danger') return 'rgba(248, 113, 113, 0.10)'
    if (tone === 'warning') return 'rgba(251, 191, 36, 0.12)'
    return theme.colors.surfaceAlt
  }};
`

const IconBox = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ tone, theme }) => {
    if (tone === 'success') return 'rgba(34, 197, 94, 0.16)'
    if (tone === 'danger') return 'rgba(248, 113, 113, 0.16)'
    if (tone === 'warning') return 'rgba(251, 191, 36, 0.18)'
    return theme.colors.primarySoft
  }};
`

const Title = styled.div`
  font-weight: 700;
  margin-bottom: 4px;
`

const Text = styled.p`
  color: ${({ theme }) => theme.colors.textSoft};
  line-height: 1.45;
`

function getSuggestionIcon(icon) {
  if (icon === 'wallet') return <FiWallet size={20} />
  if (icon === 'food') return <FiUtensils size={20} />
  if (icon === 'target') return <FiTrendingUp size={20} />
  if (icon === 'calendar') return <FiCalendar size={20} />
  if (icon === 'goal') return <FiFlag size={20} />
  if (icon === 'shield') return <FiShield size={20} />
  if (icon === 'danger') return <FiAlertTriangle size={20} />
  return <FiTarget size={20} />
}

function SuggestionsCard({ suggestions }) {
  return (
    <Card>
      <h3 style={{ marginBottom: 14 }}>Sugestões e alertas</h3>

      <List>
        {suggestions.map(item => (
          <Item key={item.id} tone={item.tone}>
            <IconBox tone={item.tone}>{getSuggestionIcon(item.icon)}</IconBox>

            <div>
              <Title>{item.title}</Title>
              <Text>{item.text}</Text>
            </div>
          </Item>
        ))}
      </List>
    </Card>
  )
}

export default SuggestionsCard