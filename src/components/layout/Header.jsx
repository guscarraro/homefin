import styled from 'styled-components'
import ThemeToggle from '../common/ThemeToggle'
import { useFinance } from '../../context/FinanceContext'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
`

const TopRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 10px;
`

const TitleBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
  flex: 1;
`

const Title = styled.h1`
  font-size: 22px;
  line-height: 1.1;
  word-break: break-word;
`

const Subtitle = styled.span`
  color: ${({ theme }) => theme.colors.textSoft};
  font-size: 13px;
  line-height: 1.3;
`

const RightBox = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
`

const MonthInput = styled.input`
  width: 88px;
  min-height: 36px;
  border-radius: 10px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surfaceAlt};
  color: ${({ theme }) => theme.colors.text};
  padding: 0 8px;
  font-size: 12px;
  outline: none;
  cursor: pointer;

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
  }

  &::-webkit-calendar-picker-indicator {
    cursor: pointer;
    opacity: 0.9;
  }
`

const ThemeIconOnly = styled.div`
  display: flex;
  align-items: center;

  button {
    min-width: 36px;
    min-height: 36px;
    padding: 0;
    border-radius: 10px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
`

function Header({ title, subtitle, showMonthSelector = false }) {
  const { selectedMonth, setSelectedMonth } = useFinance()

  return (
    <Wrapper>
      <TopRow>
        <TitleBox>
          <Title>{title}</Title>
          {subtitle ? <Subtitle>{subtitle}</Subtitle> : null}
        </TitleBox>

        <RightBox>
          {showMonthSelector ? (
            <MonthInput
              type="month"
              value={selectedMonth}
              onChange={event => setSelectedMonth(event.target.value)}
            />
          ) : null}

          <ThemeIconOnly>
            <ThemeToggle />
          </ThemeIconOnly>
        </RightBox>
      </TopRow>
    </Wrapper>
  )
}

export default Header