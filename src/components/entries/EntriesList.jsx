import styled from 'styled-components'
import EntryItem from './EntryItem'

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

function EntriesList({ entries }) {
  return (
    <List>
      {entries.map(item => (
        <EntryItem key={item.id} item={item} />
      ))}
    </List>
  )
}

export default EntriesList