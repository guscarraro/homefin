import { useEffect, useRef } from 'react'
import styled from 'styled-components'
import Header from './Header'
import BottomNav from './BottomNav'

const Wrapper = styled.div`
  min-height: 100vh;
  padding: 20px 16px 96px;
  max-width: 720px;
  margin: 0 auto;
`

const PullIndicator = styled.div`
  text-align: center;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textSoft};
  padding: 6px 0;
`

function AppShell({ title, subtitle, showMonthSelector = false, children }) {
  const startY = useRef(0)
  const pulling = useRef(false)

  useEffect(() => {
    function onTouchStart(e) {
      if (window.scrollY === 0) {
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
        window.location.reload()
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
  }, [])

  return (
    <Wrapper>
      <PullIndicator>Puxe para atualizar</PullIndicator>

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