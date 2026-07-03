import { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { FiRefreshCw } from 'react-icons/fi'
import Header from './Header'
import BottomNav from './BottomNav'
import { useFinance } from '../../context/FinanceContext'

const Wrapper = styled.div`
  min-height: 100vh;
  padding: 20px 16px 96px;
  max-width: 720px;
  margin: 0 auto;
`

const PullIndicator = styled.div`
  min-height: 30px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  text-align: center;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textSoft};
  padding: 6px 0;
`

const Spinner = styled(FiRefreshCw)`
  animation: spin 0.9s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`

function AppShell({ title, subtitle, showMonthSelector = false, children }) {
  const { reloadFinanceData } = useFinance()
  const startY = useRef(0)
  const pulling = useRef(false)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    async function refresh() {
      try {
        setRefreshing(true)
        await reloadFinanceData()
      } finally {
        window.setTimeout(() => setRefreshing(false), 350)
      }
    }

    function onTouchStart(e) {
      if (window.scrollY === 0 && !refreshing) {
        startY.current = e.touches[0].clientY
        pulling.current = true
      }
    }

    function onTouchMove(e) {
      if (!pulling.current) return

      const currentY = e.touches[0].clientY
      const diff = currentY - startY.current

      if (diff > 120) {
        pulling.current = false
        refresh()
      }
    }

    function onTouchEnd() {
      pulling.current = false
    }

    window.addEventListener('touchstart', onTouchStart)
    window.addEventListener('touchmove', onTouchMove)
    window.addEventListener('touchend', onTouchEnd)

    return () => {
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend', onTouchEnd)
    }
  }, [refreshing, reloadFinanceData])

  return (
    <Wrapper>
      <PullIndicator aria-live="polite">
        {refreshing ? (
          <>
            <Spinner size={14} />
            Atualizando dados...
          </>
        ) : (
          'Puxe para atualizar'
        )}
      </PullIndicator>

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
