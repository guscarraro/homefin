import styled from 'styled-components'
import EntryItem from './EntryItem'

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const Empty = styled.div`
  padding: 20px;
  border-radius: 18px;
  background: ${({ theme }) => theme.colors.surfaceAlt};
  color: ${({ theme }) => theme.colors.textSoft};
  line-height: 1.5;
`

function EntriesList({ entries }) {
  if (!entries.length) {
    return (
      <Empty>
        Nenhum lançamento visível neste mês ainda.
      </Empty>
    )
  }

  return (
    <List>
      {entries.map(item => (
        <EntryItem key={item.id} item={item} />
      ))}
    </List>
  )
}

export default EntriesList