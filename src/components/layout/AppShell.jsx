import styled from 'styled-components'
import Header from './Header'
import BottomNav from './BottomNav'

const Wrapper = styled.div`
  min-height: 100vh;
  padding: 20px 16px 96px;
  max-width: 720px;
  margin: 0 auto;
`

function AppShell({ title, subtitle, showMonthSelector = false, children }) {
  return (
    <Wrapper>
      <Header
        title={title}
        subtitle={subtitle}
        showMonthSelector={showMonthSelector}
      />

      {children}

      <BottomNav />
    </Wrapper>
  )
}

export default AppShell