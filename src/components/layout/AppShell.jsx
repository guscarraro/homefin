import styled from 'styled-components'
import Header from './Header'
import BottomNav from './BottomNav'

const Container = styled.div`
  min-height: 100vh;
  padding: 20px 16px 96px;
  max-width: 520px;
  margin: 0 auto;
`

function AppShell({ title, children }) {
  return (
    <>
      <Container>
        <Header title={title} />
        {children}
      </Container>
      <BottomNav />
    </>
  )
}

export default AppShell