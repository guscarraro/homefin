import styled from 'styled-components'
import Card from '../common/Card'
import { formatCurrency } from '../../utils/currency'

const Top = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 12px;
`

const Meta = styled.div`
  margin-top: 10px;
  color: ${({ theme }) => theme.colors.textSoft};
  font-size: 14px;
`

function EntryItem({ item }) {
  return (
    <Card>
      <Top>
        <div>
          <strong>{item.category}</strong>
          <div>{item.note || 'Sem observação'}</div>
        </div>
        <strong>{formatCurrency(item.amount)}</strong>
      </Top>
      <Meta>
        {item.userId} • {item.account} • {item.date}
      </Meta>
    </Card>
  )
}

export default EntryItem